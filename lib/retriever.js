"use strict"

var util = require('util');
var events = require('events');
var request = require('request');

var fs = require('fs');
var aws = require('aws-sdk');

// ---------------------------------------------------------------------------
function Retriever(uri){
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

// -----------------------------------------------------------------------------------------------
util.inherits(Retriever, events.EventEmitter);

// ---------------------------------------------------------------------------
Retriever.prototype.retrieve = function(project, uri){
	var self = this;
	
	console.log(uri);
	
	var file_name = project + '_archive_' + formatDate() + '.' + CONFIG['projects'][project]['archive_extension'],
			tmp_file = undefined;
								 
	tmp_file = fs.createWriteStream(this._tmp_file_path + file_name);
								 
  request.get(uri, function (err, resp, body) {
		if(err){
			LOG.error('Error trying to retrieve archive file at ' + uri + ' error: ' + err);
			self.emit('error: ', err);
		}
		
		if(resp.statusCode === 200){
			fs.stat(self._tmp_file_path + file_name, function(err, stats){
				if(stats.isFile()){
					tmp_file.end();
					
					// Determine how many places we need to move the file to
					var counter = 0,
							methods = (CONFIG['projects'][project]['io'] ? 1 : 0) + 
												(CONFIG['projects'][project]['aws'] ? 1 : 0);
					
					// Start a timer that will wait for each method to finish
					var timer = setInterval(function(){
						if(methods <= counter){
							clearinterval(timer);
							self.emit('done', file_name);
						}
					}, 200);
					
					// If we need to save the file to the local disk
					if(CONFIG['projects'][project]['io']){
						var dest = CONFIG['projects'][project]['io']['path'];

						// If the destination starts with a dot then we are working with a relative path
						if(dest.substring(0, 1) === '.'){
							dest = dest.replace(/\./, process.cwd());
						}
		
						dest += file_name;
						
						fs.createReadStream(self._tmp_file_path + file_name).pipe(fs.createWriteStream(dest));
						
						counter++;
					}
					
					// If we need to save the file to an AWS S3 bucket
					if(CONFIG['projects'][project]['aws']){
						try{
							aws.config.region = CONFIG['projects'][project]['aws']['region'];
		
							var aws_target = new aws.S3({params: {Bucket: CONFIG['projects'][project]['aws']['bucket']}});
																							
console.log('pushing file to aws s3 bucket');
							
							var body = fs.createReadStream(tmp_file).pipe(zlib.createGzip());
							
							aws_target.upload({Body: body}).on('httpUploadProgress', function(evt){
								LOG.info(evt);
								
							}).send(function(err, data){
								if(err){
									LOG.error('Error upload ' + file_name + ' to S3 : ' + err);
								}else{
									LOG.info('Uploaded ' + file_name + ' to ' + CONFIG['projects'][project]['aws']['bucket']);
								}
								
								counter++;
							});
							
						}catch(e){
							LOG.error('Error connecting to specified S3 bucket: ' + CONFIG['projects'][project]['aws']['bucket']);
							LOG.error(e);
							counter++;
						}
					}
					
				}else{
					self.emit('error', 'Nothing was downloaded!');
				}
			})
			
		}else{
			LOG.warn('Unable to retrieve the archive at ' + uri + ' status: ' + resp.statusCode);
			self.emit('error', resp.statusCode);
		}
		
	}).on('data', function(data) {
    // Write to local system temp file
    tmp_file.write(data);
		
  }).on('response', function(response) {
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
		var yr = now.getFullYear().toString();
		
		return yr + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]) + '_' + now.getTime(); 
	}
}

module.exports = exports = Retriever;