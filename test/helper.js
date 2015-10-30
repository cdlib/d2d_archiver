"use strict";

var assert = require('assert');
var express = require('express');
var bunyan = require('bunyan');

module.exports = global.LOG = bunyan.createLogger({name: 'tester', 
																									 streams: [{level: 'debug',
																														 stream: process.stdout}]});

module.exports = global.CONFIG = require("./config/app_test.json");
