var express = require("express");
var socket = require("socket.io");
var app = express();
var fs = require("fs");
var path = require('path');

var server = app.listen(8080, function(){
  console.log("Listening to requests on port 25565");
});

app.use(express.static("public"))

var io = socket(server);


io.on("connection", function(socket){
  console.log("User connected");

socket.on('disconnect', function(){
  console.log("User disconnected");


  });

});
