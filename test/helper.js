"use strict";

var assert = require('assert');
var express = require('express');
var bunyan = require('bunyan');

module.exports = global.LOG = bunyan.createLogger({name: 'tester', 
                                                   streams: [{level: 'debug',
                                                             stream: process.stdout}]});

module.exports = global.CONFIG = require("./config/app_test.json");

var server = require('../lib/server.js');
    
// Allow the server to serve up files from test/data
server.use(express.static('./test'));

// Startup the web server  
server.listen(CONFIG['server']['port'], function(){
  LOG.info(CONFIG['server']['name'] + " listening on port " + CONFIG['server']['port']);
});