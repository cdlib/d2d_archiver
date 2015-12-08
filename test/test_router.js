"use strict";

var assert = require('assert');
var url = require('url');

var helper = require("./helper.js");

describe('router.js testing', function() {
  this.timeout(20000);
  
  var real_target = 'tester/' + CONFIG['projects']['tester']['key'],
      test_file = 'http://localhost:' + CONFIG['server']['port'] + '/data/sample.zip';

  // ------------------------------------------------------------------------------
  it('should return a project not found - 404', function(done) {
    sendRequest('invalid/', 'GET', '', function(status, headers, body){
      assert.equal(status, 404);
      
      done();
    });
  });
  
  // ------------------------------------------------------------------------------
  it('should return the default message', function(done) {
    sendRequest('tester/', 'GET', '', function(status, headers, body){
      assert.equal(status, 200);
      assert(body.indexOf("You have reached ") >= 0);
      
      done();
    });
  });
  
  // ------------------------------------------------------------------------------
  it('should return a status 404 - unknown project', function(done) {
    sendRequest('invalid/', 'POST', '', function(status, headers, body){
      assert.equal(status, 404);
      
      sendRequest('invalid/1234/', 'POST', '', function(status, headers, body){
        assert.equal(status, 404);
      
        done();
      });
    });
  });
  
  // ------------------------------------------------------------------------------
  it('should return a status 401 - unauthorized (bad key)', function(done) {
    sendRequest('tester/123ABC/', 'POST', '', function(status, headers, body){
      assert.equal(status, 401);
      
      done();
    });
  });
  
  // ------------------------------------------------------------------------------
  it('should return a status 405 - unrecognized URI', function(done) {
    sendRequest(real_target, 'POST', 'uri=http://someserver.org/data/sample.zip', function(status, headers, body){
      assert.equal(status, 405);
      
      done();
    });
  });
  
  // ------------------------------------------------------------------------------
  it('should return a status 200 and place the archive sample file in ../tmp', function(done) {
    sendRequest(real_target, 'POST', 'uri=' + test_file, function(status, headers, body){
      assert.equal(status, 200);
      
      done();
    });
  });
  
});

// ----------------------------------------------------------------------------------------
var sendRequest = function(target, method, data, callback){
  var http = require('http');
  
  var targ = url.parse('http://localhost:' + CONFIG['server']['port'] + '/' + target);
  
  var options = {hostname: targ.hostname,
                 port: targ.port,
                 path: targ.path,
                 method: method,
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
  
  try {
    var req = http.request(options, function(resp) {
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

    req.end(data);
    
  } catch (err) {
    LOG.error('Error connecting to server: ' + err.message);
    console.log(err.stack);
  }

};
