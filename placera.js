
// Socket.io
var socket = io.connect('http://213.66.254.63:3074', {secure: true});

getID();

// Generate ID
function getID(){
  if(localStorage.id == null){
    var newID = Math.floor(Math.random() * 10000000000);
    localStorage.setItem("id", newID)
    console.log("Generated new ID");
  }
  console.log("Welcome back! " + localStorage.id);
}

// Initiate some stuff
document.getElementById("timelapse_speed").value = 1;


// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var overlay = document.getElementById("overlay");
var ctxOverlay = overlay.getContext("2d");

var pixels = [];

var mouseX;
var mouseY;

var color = "34, 34, 34";
var lastColor;

function changeColor(newColor){
  color = newColor;
  focusPalette();
}


var palette = ["255, 255, 255", "228, 228, 228", "136, 136, 136", "34, 34, 34", "255, 167, 209", "229, 0, 0", "229, 149, 0", "160, 106, 66", "229, 217, 0", "148, 224, 68", "2, 190, 1", "0, 211, 221", "0, 131, 199", "0, 0, 234", "207, 110, 228", "130, 0, 128"];

generateButton();
function generateButton(){
  var i = 0;
  while(palette.length > i){

    var color = palette[i];
    document.getElementById("palette").innerHTML += '<button type="button" id="' + palette[i] + '" class="colorPick" onclick="changeColor(this.id)" style="background-color: rgb(' + palette[i] + ')"></button>';
    i++;
  }
}

focusPalette();

function focusPalette(){
  if(lastColor != null){
  document.getElementById(lastColor).style.outline = "0px solid white";}
  document.getElementById(color).style.outline = "5px solid white";
  lastColor = color;
}


function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }


overlay.addEventListener("mouseout", function(){
  ctxOverlay.clearRect(0, 0, canvas.width, canvas.height);
  drawGridVert();
  drawGridHor();

})

drawGridVert();
drawGridHor();

function drawGridVert(){
  i = 0;
  while(i < canvas.width){
    ctxOverlay.fillStyle = "rgba(0,0,0,0.05)";
    ctxOverlay.fillRect(i, 0, 2, canvas.height);
    i = i+10;
  }
}

function drawGridHor(){
  i = 0;
  while(i < canvas.height){
    ctxOverlay.fillStyle = "rgba(0,0,0,0.05)";
    ctxOverlay.fillRect(0, i, canvas.width, 2);
    i = i+10;
  }
}

var cooldownOver;
var cooldownTime;
var messages = ["Clear to doodle!", "Ready for art!", "Paint on!", "Clear!", "I'm ready!", "It's over :)", "Time over", "Place on!", "You are now cool.", "BOI"];

socket.on("cooldown", function(time){
  console.log(time);
  cooldownOver = false;
  cooldownTime = time;
  runCooldown();
});

function runCooldown(){
  var now = Date.now();
  if(cooldownTime > now){
    var timeLeft = cooldownTime - now;
    document.getElementById("cooldown").innerHTML = "Cooldown: " + (timeLeft/1000).toFixed(1) + "s";
    setTimeout(runCooldown, 100);
    return;
  }
  var message = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("cooldown").innerHTML = message;
  }

function clearCooldown(){
  // Only run this on load to clear the coold down and insert a message.
  var message = messages[Math.floor(Math.random() * messages.length)];
  document.getElementById("cooldown").innerHTML = message;

}


overlay.addEventListener('mousemove', function(evt) {

  var mousePos = getMousePos(canvas, evt);
  mouseX = mousePos.x -1;
  mouseY = mousePos.y -1;
  // mousePos.x + mousePos.y

ctxOverlay.clearRect(0, 0, canvas.width, canvas.height);

mouseX = Math.floor(mouseX / 10);
mouseY = Math.floor(mouseY / 10);

document.getElementById("coordinates").innerHTML = "X: " + (mouseX+1) + " Y: " + (mouseY+1);

mouseX = mouseX * 10;
mouseY = mouseY * 10;

ctxOverlay.fillStyle = "rgba(" + color + ",.6)";
ctxOverlay.fillRect(mouseX, mouseY, 10, 10);

drawGridVert();
drawGridHor();

}, false);


// Run
//setInterval(update, 16);


// Hide cursor?
//document.body.style.cursor = 'none';
var allPixels = pixels;
var pos = 0;
function timelapse(){
  allPixels = pixels;
  pixels = [];
  pos = 0;
  runTimelapse();
}

function runTimelapse(){
  setTimeout(function () {

    if(allPixels.length > pos){
      pixels.push(allPixels[pos]);
      pos = pos + 1;
      drawCache();
      var i = 0;
      document.getElementById("timelapse_status").innerHTML = pixels.length + "/" + allPixels.length;
    }
  }, 0.0001);
  runTimelapse();
}

drawCache();

function drawCache(){

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var i = 0;
  while(i < pixels.length){
    ctx.fillStyle = "rgb(" + pixels[i].color + ")";
    ctx.fillRect(pixels[i].x, pixels[i].y, 10, 10);
    i++;
  }

}


// Place pixels user
overlay.addEventListener("click", function(){
  mouseX = Math.round(mouseX / 10);
  mouseX = mouseX * 10;

  mouseY = Math.round(mouseY / 10);
  mouseY = mouseY * 10;

  var  newPixel = {
    x: mouseX,
    y: mouseY,
    color: color,
    id: localStorage.id
  };
  console.log(newPixel);
  socket.emit("newpixel", newPixel);

});


var updatePixel;
// Update on new pixel
socket.on("update", function(pixel){
  ctx.fillStyle = "rgb(" + pixel.color + ")";
  ctx.fillRect(pixel.x, pixel.y, 10, 10);
});



socket.on("cache", function(allPixels){
  pixels = allPixels;
  drawCache();
});
