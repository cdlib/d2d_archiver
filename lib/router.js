'use strict';

var express = require('express');

var router = express.Router();

router.use(function(req, res, next){
	LOG.info("Request Time: " + Date.now());
	next();
});

router.get('/', function(req, res){
	
	res.render('index', { title: 'The Mariner Report', 
												message: 'Welcome to the news feed!',
												categories: cache.getCategories()});
});

module.exports = router;