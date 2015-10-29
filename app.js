'use strict';

var configurer = require('./lib/configurer.js');

configurer.startup((process.argv[2] ? '/' + process.argv[2] : process.cwd() + '/config/app.json'), function(){
	var express = require('express');
	var bodyParser = require('body-parser');
	
	var router = require('./lib/router.js');
	var server = express();
	
	server.use(bodyParser.urlencoded({extended: true}));
	server.use(router);

	// Startup the web server	
	server.listen(CONFIG['server']['port'], function(){
		LOG.info(CONFIG['server']['name'] + " listening on port " + CONFIG['server']['port']);
	});

	server.on('close', function(){
		LOG.info(CONFIG['server']['name'] + " no longer listening on port " + CONFIG['server']['port']);
	})

	server.on('error', function(err){
		LOG.error(CONFIG['server']['name'] + " has encountered an error: ", err);
	});
});

