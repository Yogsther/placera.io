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

  var client_ip_address = socket.request.connection.remoteAddress;

  console.log(client_ip_address);

socket.on('disconnect', function(){
});


// Placera.io handler

var allowedColors = ["255, 255, 255", "228, 228, 228", "136, 136, 136", "34, 34, 34", "255, 167, 209", "229, 0, 0", "229, 149, 0", "160, 106, 66", "229, 217, 0", "148, 224, 68", "2, 190, 1", "0, 211, 221", "0, 131, 199", "0, 0, 234", "207, 110, 228", "130, 0, 128"];
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
