
// Socket.io
var socket = io.connect('http://213.66.254.63:3074', {secure: true});

getID();

// Generate ID
function getID(){
  if(localStorage.id == null){
    console.log("hi.");
  }


}



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


overlay.addEventListener('mousemove', function(evt) {
  // TODO draw cursor on new canvas

ctxOverlay.clearRect(0, 0, canvas.width, canvas.height);

mouseX = Math.floor(mouseX / 10);
mouseX = mouseX * 10;

mouseY = Math.floor(mouseY / 10);
mouseY = mouseY * 10;

ctxOverlay.fillStyle = "rgba(" + color + ",.6)";
ctxOverlay.fillRect(mouseX, mouseY, 10, 10);

      var mousePos = getMousePos(canvas, evt);
      mouseX = mousePos.x -1;
      mouseY = mousePos.y -1;
      // mousePos.x + mousePos.y
}, false);


// Run
//setInterval(update, 16);


// Hide cursor?
//document.body.style.cursor = 'none';
var allPixels = pixels;
var pos = 0;
var lapseTime;
function timelapse(time){
  allPixels = pixels;
  pixels = [];
  pos = 0;
  runTimelapse();
  lapseTime = time;
}

function runTimelapse(){
  if(allPixels.length > pos){
    pixels.push(allPixels[pos]);
    setTimeout(runTimelapse,lapseTime);
    pos = pos + 1;
    drawCache();
  }
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
    color: color
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


console.log("Hi fellow coder, want to see something cool? enter timelapse(1); in the console, and you'll see magic!");
