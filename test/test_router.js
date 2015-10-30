"use strict";

var assert = require('assert');
var url = require('url');

var helper = require("./helper.js");

describe('router.js testing', function() {
  this.timeout(20000);
	
	var projects = undefined;
	
	// ------------------------------------------------------------------------------
  before(function(done) {
		var server = require('../lib/server.js');
		
		// Startup the web server	
		server.listen(CONFIG['server']['port'], function(){
			LOG.info(CONFIG['server']['name'] + " listening on port " + CONFIG['server']['port']);

			done();
		});
	});
	
	// ------------------------------------------------------------------------------
	it('should return a project not found - 404', function(done) {
		sendRequest('invalid/', 'GET', {}, function(status, headers, body){
			assert.equal(status, 404);
			
			done();
		});
	});
	
	// ------------------------------------------------------------------------------
	it('should return the default message', function(done) {
		sendRequest('tester/', 'GET', {}, function(status, headers, body){
			assert.equal(status, 200);
			assert(body.indexOf("You have reached ") >= 0);
			
			done();
		});
	});
	
	// ------------------------------------------------------------------------------
/*	it('should return a status 404 - unknown project', function(done) {
		sendRequest('invalid/', 'POST', {}, function(status, headers, body){
			assert.equal(status, 404);
			assert(body.indexOf("You have reached ") >= 0);
			
			done();
		});
	});
	
	// ------------------------------------------------------------------------------
	it('should return a status 401 - unauthorized (bad key)', function(done) {
		sendRequest('tester/123ABC/', 'POST', {}, function(status, headers, body){
			assert.equal(status, 401);
			assert(body.indexOf("You have reached ") >= 0);
			
			done();
		});
	});
	
	// ------------------------------------------------------------------------------
	it('should return a status 405 - unrecognized URI', function(done) {
		var data = {'uri': 'http://localhost:' + CONFIG['server']['port'] + '/data/sample.zip'};
		
		sendRequest('tester/123ABC/', 'POST', data, function(status, headers, body){
			assert.equal(status, 405);
			assert(body.indexOf("You have reached ") >= 0);
			
			done();
		});
	});
	
	// ------------------------------------------------------------------------------
	it('should return a status 200 and place the archive sample file in ../tmp', function(done) {
		sendRequest('tester/', 'POST', {}, function(status, headers, body){
			assert.equal(status, 200);
			assert(body.indexOf("You have reached ") >= 0);
			
			done();
		});
	});*/
	
});

// ----------------------------------------------------------------------------------------
var sendRequest = function(target, method, data, callback){
  var http = require('http');
	
	var target = url.parse(target);
	var options = {hostname: target.hostname,
                 port: target.port,
                 path: target.path,
                 method: method};
						
	var uri = 'http://localhost:' + CONFIG['server']['port'] + '/' + target;
	
  try {
    var req = http.request(uri, function(resp) {
      var data = '';

      resp.on('data', function(chunk) {
        data += chunk;
      });

      // ---------------------------------------------------
      resp.on('end', function() {
        callback(resp.statusCode, resp.headers, data);
      });
    });

    req.on('error', function(err) {
      LOG.error(err.message);
      console.log(err.stack);
    });

    req.end();

  } catch (err) {
    LOG.error('Error connecting to server: ' + err.message);
		console.log(err.stack);
  }

};
