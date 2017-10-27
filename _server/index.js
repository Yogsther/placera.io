var express = require("express");
var socket = require("socket.io");
var app = express();
var fs = require("fs");
var path = require('path');


var server = app.listen(3074, function(){
  console.log("Listening to requests on port 3074");
});

app.use(express.static("public"))

var io = socket(server);

// Pixels cache
var pixels = [];
//fsPixelsRead();

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
    io.sockets.emit("update", newPixel);
    fsPixelsSave();
});


});
// Get saved pixels from .txt file
function fsPixelsRead(){
    var readPixel = fs.readFileSync("placera.txt");
    var pixelArr = readPixel.toString().split(",");

    var i = 0;
    while(i < pixelArr.length){
      console.log("TEST: "+pixelArr[i]);
      var pushMe = JSON.parse(pixelArr[i]);
      pixels.push(pushMe);
    }
}

function fsPixelsSave(){
  //var saveMe = pixels.join(",");
  var saveMe = saveMe.toString();
  fs.writeFileSync("placera.txt", saveMe);
}
