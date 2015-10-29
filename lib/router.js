'use strict';

var express = require('express');
var router = express.Router();

var Retriever = require('./retriever.js');

// ----------------------------------------------------------------------------------------
router.use(function(req, res, next){
	LOG.info("Request Time: " + Date.now());
	next();
});

// ----------------------------------------------------------------------------------------
router.get('/:project', function(req, res){
	if(validProject(req.params.project)){
		res.status(200).send("You have reached the " + req.params.project + " but its looking for a POST.");
		
	}else{
		res.status(404).end(); // project not found
	}
});

// ----------------------------------------------------------------------------------------
router.post('/:project/:key', function(req, res){
	if(validProject(req.params.project)){
		if(validKey(req.params.project, req.params.key)){
			var uri = req.body[CONFIG['projects'][req.params.project]['uri_form_field']];
			
			console.log(req.body);
			
			if(validUri(req.params.project, uri)){
				res.sendStatus(200).end();
			
				LOG.info('Request received for ' + req.params.project + ' - archive file at ' + uri);
			
				var retriever = new Retriever();
				retriever.retrieve(req.params.project, uri);
			
			}else{
				LOG.warn('Received a request for ' + req.params.project + ' with a valid key but wrong domain - ' + uri);
				res.sendStatus(405).end(); // not allowed - uri is sending us to an unexpected domain
			}
			
		}else{
			LOG.warn('Received a request for ' + req.params.project + ' with an invalid - ' + req.params.key);
			res.sendStatus(401).end(); // unauthorized - key does not match
		}
	
	}else{
		LOG.warn('Received a request for and invalid project - ' + req.params.project);
		res.sendStatus(404).end(); // project not found
	}
});

// ----------------------------------------------------------------------------------------
function validProject(project){ return CONFIG['projects'][project] != null; }
function validKey(project, key){ return CONFIG['projects'][project]['key'].toString() == key; }
function validUri(project, uri){ return (uri == null ? false : (uri.indexOf(CONFIG['projects'][project]['domain'].toString()) >= 0)); } 

module.exports = router;