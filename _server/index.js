var express = require("express");
var socket = require("socket.io");
var app = express();
var fs = require("fs");
var path = require('path');


// Enable or Disable cooldown
var cooldownEnabled = true;
// Cooldown time (ms)
var cooldownTime = 20000;


var server = app.listen(3074, function(){
  console.log("Listening to requests on port 3074");
});

app.use(express.static("public"))

var io = socket(server);

// Pixels cache
var pixels = [];
var cooldownList = [];
var allowedColors = ["255, 255, 255", "228, 228, 228", "136, 136, 136", "34, 34, 34", "255, 167, 209", "229, 0, 0", "229, 149, 0", "160, 106, 66", "229, 217, 0", "148, 224, 68", "2, 190, 1", "0, 211, 221", "0, 131, 199", "0, 0, 234", "207, 110, 228", "130, 0, 128"];

fsPixelsRead();

io.on("connection", function(socket){
  io.sockets.connected[socket.id].emit("cache", pixels);

socket.on('disconnect', function(){
});


// Placera.io handler

// Register new pixels
socket.on("newpixel", function(newPixel){
  try{

    if(isNaN(newPixel.id)){
      return;
    }

    if(cooldownList.indexOf(newPixel.id) != -1){

      return;
    }

    if(allowedColors.indexOf(newPixel.color) == -1){
      console.log("Bad color");
      return;
    }

    var paletteTranslate = ["white", "grey", "dark grey", "black", "pink", "red", "orange", "brown", "yellow", "light green", "green", "turquoise", "blue", "dark blue", "dark pink", "purple"];
    var colorPos = allowedColors.indexOf(newPixel.color);


    // Log pixel in console
    console.log(newPixel.username + " placed a " + paletteTranslate[colorPos] + " pixel @ " + newPixel.x + ", " + newPixel.y);

    newPixelF = {
      x: newPixel.x,
      y: newPixel.y,
      color: newPixel.color
    };

    // Add user to cooldown list
    if(cooldownEnabled){
    io.sockets.connected[socket.id].emit("cooldown", cooldownTime);
    cooldownList.push(newPixel.id);
    var timeoutFunction = function() { removeCooldown(newPixel.id); };
    setTimeout(timeoutFunction, 20000);
    }

    pixels.push(newPixelF);
    io.sockets.emit("update", newPixelF);
    fsPixelsSave();
  }catch(e){
    console.log(e);
    return;
  }
});


function removeCooldown(id){
  var index = cooldownList.indexOf(id);
  cooldownList.splice(index, 1);
}


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
