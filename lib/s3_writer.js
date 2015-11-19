"use strict"

var fs = require('fs');
var zlib = require('zlib');
var AWS = require('aws-sdk');

// ---------------------------------------------------------------------------
function S3Writer(){
	
}

// ---------------------------------------------------------------------------
S3Writer.prototype.write = function(params, file_path, callback){
	var stream = fs.createReadStream(file_path);
	
console.log(params['Region']);
	
	AWS.config.region = params['Region'];
	
	var s3 = new AWS.S3({params: params});
	
	s3.putObject({Body: stream.pipe(zlib.createGzip())}, function(err, data){
		if(err){
			LOG.error('Unable to place ' + params['Key'] + ' onto ' + params['Bucket']);
			LOG.error(err);
			
		}else{
			LOG.info('Stored ' + params['Key'] + ' on ' + params['Bucket']);
		}
		
		callback();
	});
}

module.exports = exports = S3Writer;