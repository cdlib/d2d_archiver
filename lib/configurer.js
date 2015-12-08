'use strict';

var fs = require('fs');
var bunyan = require('bunyan');

exports.startup = function(config_path, callback){
  var config = require(config_path);

  // Setup the logging
  var streams = {level: config['server']['log']['level']};

  if (config['server']['log']['name']) {
    streams.path = config['server']['log']['path'] + config['server']['log']['name'];
  } else {
    streams.stream = process.stdout;
  }

  module.exports = global.LOG = bunyan.createLogger({name: config['server']['name'], streams: [streams]});
  
  module.exports = global.CONFIG = config;
  
  callback();
}