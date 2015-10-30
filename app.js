'use strict';

var configurer = require('./lib/configurer.js');

var config_file = (process.argv[2] ? '/' + process.argv[2] : process.cwd() + '/config/app.json');

configurer.startup(config_file, function(){
	var server = require('./lib/server.js');
	
	// Startup the web server	
	server.listen(CONFIG['server']['port'], function(){
		LOG.info(CONFIG['server']['name'] + " listening on port " + CONFIG['server']['port']);
	});
});

