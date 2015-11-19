"use strict"

var fs = require('fs');
var AWS = require('aws-sdk');

// ---------------------------------------------------------------------------
function S3Writer(){
	
}

// ---------------------------------------------------------------------------
S3Writer.prototype.write = function(params, file_path, callback){
	var stream = fs.createReadStream(file_path);
	
	AWS.config.region = params['Region'];
	
	var s3 = new AWS.S3({params: params});
	
	s3.upload({Body: stream}, function(err, data){
		if(err){
			LOG.error('Unable to place ' + params['Key'] + ' onto ' + params['Bucket']);
			LOG.error(err);
			
		}else{
			console.log(data);
			LOG.info('Stored ' + params['Key'] + ' on ' + params['Bucket']);
		}
		
		callback();
	});
}

module.exports = exports = S3Writer;