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
fsPixelsRead();

io.on("connection", function(socket){
  console.log("User connected");
  io.sockets.connected[socket.id].emit("cache", pixels);


socket.on('disconnect', function(){
});


// Placera.io handler

var allowedColors = ["0,0,0", "170,0,0", "0,170,0", "170,85,0", "0,0,170", "170,0,170", "0,170,170", "170,170,170", "255,255,255"];
// Register new pixels
socket.on("newpixel", function(newPixel){
    try{
    if(allowedColors.indexOf(newPixel.color) == -1){
      console.log("Bad color");
      console.log(newPixel.color)
      console.log(newPixel.color.indexOf(allowedColors))
      console.log(allowedColors[0]);
      return;
    }
    pixels.push(newPixel);
    io.sockets.emit("update", newPixel);
    fsPixelsSave();
  }catch(e){
    console.log(e);
    return;
  }
});


});
// Get saved pixels from .txt file
function fsPixelsRead(){
    var readPixel = fs.readFileSync("placera.txt", "utf8");
    var pixelArr = readPixel.toString().split("|");

    var i = 0;
    while(i < pixelArr.length - 1){
      var pushMe = JSON.parse(pixelArr[i]);
      pixels.push(pushMe);
      i++;
    }
    console.log("Loaded pixels. " + pixelArr.length + " pixels.");
}

function fsPixelsSave(){
  var saveArr = [];
  var i = 0;
  while(i < pixels.length){
    var saveObj = JSON.stringify(pixels[i]);
    saveArr.push(saveObj);
    i++;
  }
  saveArr = saveArr.join("|");
  fs.writeFileSync("placera.txt", saveArr, "utf8")
}
