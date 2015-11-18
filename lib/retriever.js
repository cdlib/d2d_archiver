"use strict"

var util = require('util');
var events = require('events');
var request = require('request');
var fs = require('fs');

// ---------------------------------------------------------------------------
function Retriever(uri){
	this._timeout = CONFIG['server']['retriever']['timeout'];
	this._max_size = CONFIG['server']['retriever']['max_file_size'];
}

// -----------------------------------------------------------------------------------------------
util.inherits(Retriever, events.EventEmitter);

// ---------------------------------------------------------------------------
Retriever.prototype.retrieve = function(project, uri){
	var self = this;
	
	var contents = undefined,
			fs_target = undefined,
			aws_target = undefined;
								 
	// Create a file on the local system if specified to do so
	if(CONFIG['projects'][project]['io']){
		var dest = CONFIG['projects'][project]['io']['path'];
		
		// If the destination starts with a dot then we are working with a relative path
		if(dest.substring(0, 1) === '.'){
			dest = dest.replace(/\./, process.cwd());
		}
		
		dest += project + '_archive_' + formatDate() + '.' + CONFIG['projects'][project]['io']['extension'];

		fs_target = fs.createWriteStream(dest);
	}
	
	// Connect up to the AWS S3 bucket if specified to do so
	if(CONFIG['projects'][project]['aws']){
		var dest = "";

		// connect to the AWS bucket
	}
								 
  request.get(uri, function (err, resp, body) {
		if(err){
			LOG.error('Error trying to retrieve archive file at ' + uri + ' error: ' + err);
			self.emit('error', err);
		}
		
		if(resp.statusCode === 200){
			if(fs_target != undefined){
				fs_target.end();
			}
			
			self.emit('complete', contents);
			
		}else{
			LOG.warn('Unable to retrieve the archive at ' + uri + ' status: ' + resp.statusCode);
			self.emit('error', resp.statusCode);
		}
		
	}).on('data', function(data) {
    if(fs_target != undefined){
			// Write to local system
    	fs_target.write(data);
    }
		
		if(aws_target != undefined){
			// Write to bucket
		}
		
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // compressed data as it is received
      console.log('received ' + data.length + ' bytes of compressed data from ' + uri);
    })
  });

	// ---------------------------------------------------
	function formatDate(){
		var now = new Date();
		var mm = (now.getMonth()+1).toString();
		var dd = now.getDate().toString();
		
		return now.getFullYear().toString() + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); 
	}
}

module.exports = exports = Retriever;