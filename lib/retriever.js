"use strict"

var util = require('util');
var events = require('events');
var request = require('request');

var fs = require('fs');

var FsWriter = require('./fs_writer.js');
var S3Writer = require('./s3_writer.js');

// ---------------------------------------------------------------------------
function Retriever(){
  var self = this;
  
  this._timeout = CONFIG['server']['retriever']['timeout'];
  this._max_size = CONFIG['server']['retriever']['max_file_size'];
  
  this._tmp_file_path = process.cwd() + "/tmp/",
  
  this.on('done', function(file_name){
    LOG.info('Finished retrieving ' + file_name);
    
    fs.unlinkSync(self._tmp_file_path + file_name);
    
    self.emit('complete', file_name);
  });
}

//----------------------------------------------------------------------------
util.inherits(Retriever, events.EventEmitter);

// ---------------------------------------------------------------------------
Retriever.prototype.retrieve = function(project, uri){
  var self = this;
  
  console.log(uri);
  
  var file_name = project + '_archive_' + formatDate() + '.gz',
      tmp_file = undefined;
                 
  tmp_file = fs.createWriteStream(this._tmp_file_path + file_name);
                 
  tmp_file.on('finish', function(){
    // Determine how many places we need to move the file to
    var counter = 0,
        methods = (CONFIG['projects'][project]['io'] ? 1 : 0) + 
                  (CONFIG['projects'][project]['aws'] ? 1 : 0);

    // Start a timer that will wait for each method to finish
    var timer = setInterval(function(){
      if(methods <= counter){
        clearInterval(timer);
        self.emit('done', file_name);
      }
    }, 200);

    // If we need to save the file to the local disk
    if(CONFIG['projects'][project]['io']){
      var writer = new FsWriter();
  
      var dest = CONFIG['projects'][project]['io']['path'];

      // If the destination starts with a dot then we are working with a relative path
      if(dest.substring(0, 1) === '.'){
        dest = dest.replace(/\./, process.cwd());
      }

      dest += file_name

      writer.write(dest, self._tmp_file_path + file_name, function(){
        counter++;
      });
    }

    // If we need to save the file to an AWS S3 bucket
    if(CONFIG['projects'][project]['aws']){
      var writer = new S3Writer();
  
      var params = {'Region': CONFIG['projects'][project]['aws']['region'],
                    'Bucket': CONFIG['projects'][project]['aws']['bucket'],
                    'Key': CONFIG['projects'][project]['aws']['key_prefix'] + file_name};
  
      writer.write(params, self._tmp_file_path + file_name, function(){
        counter++;
      });
    }
  });
                 
  request(uri).pipe(tmp_file);

  // ---------------------------------------------------
  function formatDate(){
    var now = new Date();
    var mm = (now.getMonth()+1).toString();
    var dd = now.getDate().toString();
    var yr = now.getFullYear().toString();
    
    return yr + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]) + '_' + now.getTime(); 
  }
}

module.exports = exports = Retriever;