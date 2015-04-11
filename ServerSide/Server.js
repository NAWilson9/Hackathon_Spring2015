//Link dependencies
var express = require('express');
var bodyParser = require('body-parser');

//Create server
var server = express();

//Server Setup
server.use(bodyParser.json());
server.use(express.static('../ClientSide/'));

//Start server
server.listen(1337, function() {
    console.log('Hackathon server running on port ' + 1337);
});