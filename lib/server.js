'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var router = require('./router.js');
var server = express();

server.use(bodyParser.urlencoded({extended: true}));
server.use(router);

server.on('close', function(){
	LOG.info(CONFIG['server']['name'] + " no longer listening on port " + CONFIG['server']['port']);
})

server.on('error', function(err){
	LOG.error(CONFIG['server']['name'] + " has encountered an error: ", err);
});

module.exports = exports = server;