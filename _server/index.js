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

// Pixels cache
var pixels = [];

io.on("connection", function(socket){
  console.log("User connected");
  io.sockets.connected[socket.id].emit("cache", pixels);




socket.on('disconnect', function(){
  console.log("User disconnected");
  });


  // Placera.io handler

socket.on("newpixel", function(newPixel){
    console.log(pixels);
    pixels.push(newPixel);
    socket.emit("update", newPixel);
});


});
