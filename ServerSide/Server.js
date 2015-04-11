//Link dependencies
var express = require('express');
var bodyParser = require('body-parser');
var Database = require('fileDB.js').Database;
var fs = require("fs");

//Create server
var server = express();

//Server Setup
server.use(bodyParser.json());
server.use(express.static('../ClientSide/'));

//server.get('/test', function(req, res){
//
//});

//Start server
server.listen(1337, function() {
    console.log('Hackathon server running on port ' + 1337);

	// database test, shows it works, delete if you want
	var test = Database('test');
	test.put("hello", "world", function(){

		test.get("hello", function(err, data){console.log(data)});

	});

});