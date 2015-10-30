"use strict"

var url = require('url');
var request = require('request');
var fs = require('fs');

// ---------------------------------------------------------------------------
function Retriever(uri){
	this._timeout = CONFIG['server']['retriever']['timeout'];
	this._max_size = CONFIG['server']['retriever']['max_file_size'];
}

// ---------------------------------------------------------------------------
Retriever.prototype.retrieve = function(project, uri){
	
	var options = {method: 'GET', 
								 uri: uri,
								 headers: CONFIG['projects'][project]['headers'],
								 gzip: true}
								 
  request(options, function (err, resp, body) {
		// body is the decompressed response body
		console.log('server encoded the data as: ' + (resp.headers['content-encoding'] || 'identity'))
		console.log('the decoded data is: ' + body)
    }
  ).on('data', function(data) {
    // decompressed data as it is received
    console.log('decoded chunk: ' + data)
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // compressed data as it is received
      console.log('received ' + data.length + ' bytes of compressed data')
    })
  });
	
	
	/*
	var target = url.parse(uri);
	var out = null;
	var http = null;
	var payload = null;
	
	var options = {hostname: target.hostname,
                 port: target.port,
                 path: target.path,
                 method: 'GET',
                 headers: {}};
	
	// Setup the correct library based on the URL's protocol
  if(target.protocol === 'https') {
    http = require('https');
  }else{
  	http = require('http');
  }
	
	LOG.info('Retrieving archive file from ' + uri);
	
	// Do the HTTP(S) Request
	// ---------------------------------------------------
  var req = http.request(options, function(res) {
		
		res.on('data', function(chunk){
			console.log(res);
			
			if(CONFIG['projects'][project]['io']){
				var dest = CONFIG['projects'][project]['io']['path'] + '/' + project + '_archive_' + formatDate() + '.bak';
			
				fs.writeFile(dest, chunk, function(err){
					if(err){
						LOG.error('Error writing to disk.');
					
					}else{
						LOG.info('Archive file for ' + project + ' successfully downloaded to ' + dest);
					}
				});
			}
			
			if(CONFIG['projects'][project]['aws']){
				LOG.info('Need to put the file in an AWS S3 bucket ... not yet implemented though');
			}
		});
		
		res.on('error', function(err){
			LOG.error(err.message);
		});
	});
	
	// ---------------------------------------------------
	req.setTimeout(this._timeout, function(){
		LOG.warn('Timeout while attempting to retrieve archive file at ' + uri);
		req.abort();
	});
	
	// ---------------------------------------------------
	req.on('error', function(e){
		LOG.error('Error attempting to retrieve archive file at ' + uri + ' - ' + e.message);
		req.abort();
	});
	
	req.end();*/
	
	// ---------------------------------------------------
	function formatDate(){
		var now = new Date();
		var mm = (this.getMonth()+1).toString();
		var dd = this.getDate().toString();
		
		return now.getFullYear().toString() + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); 
	}
}

module.exports = exports = Retriever;