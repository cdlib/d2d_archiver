"use strict";

var assert = require('assert');
var url = require('url');
var fs = require('fs');

var helper = require("./helper.js");
var Retriever = require('../lib/retriever.js');

describe('retriever.js testing', function() {
  this.timeout(20000);
	
	var test_file = test_file = 'http://localhost:' + CONFIG['server']['port'] + '/data/sample.zip';
	
	// ------------------------------------------------------------------------------
	it('should retrieve the file and place it in the /tmp folder', function(done){
		var retriever = new Retriever();
		
		var dest = CONFIG['projects']['tester']['io']['path'];
		
		// If the destination starts with a dot then we are working with a relative path
		if(dest.substring(0, 1) === '.'){
			dest = dest.replace(/\./, process.cwd());
		}
		
		dest += 'tester_archive_' + formatDate() + '.' + CONFIG['projects']['tester']['io']['extension'];
		
		
		retriever.retrieve('tester', test_file);
		
		// ------------------------------------------
		retriever.on('error', function(err){
			assert.equal(null, err);
			done();
		});
		
		// ------------------------------------------
		retriever.on('complete', function(file_name){
			
			console.log(dest + file_name);
			
			fs.stat(dest + file_name, function(err, stats){
				if(err){ 
					LOG.error(err); 
					done(); 
				
				}else{
					assert(stats.isFile());
				
					fs.unlinkSync(dest + file_name);
					done();
				}
			});
			
		});
	});
	
});

// ---------------------------------------------------
function formatDate(){
	var now = new Date();
	var mm = (now.getMonth()+1).toString();
	var dd = now.getDate().toString();
	var yr = now.getFullYear().toString();
	
	return yr + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]) + '_' + now.getTime(); 
}