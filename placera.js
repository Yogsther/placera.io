
// Socket.io
var socket = io.connect('http://213.66.254.63:3074', {secure: true});

// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var pixels = [];

var mouseX;
var mouseY;



var color = "0,0,0";

function changeColor(newColor){
  color = newColor;
  console.log(color);
}


var palette = ["0,0,0", "170,0,0", "0,170,0", "170,85,0", "0,0,170", "170,0,170", "0,170,170", "170,170,170", "255,255,255"];

generateButton();
function generateButton(){
  var i = 0;
  while(palette.length > i){

    var color = palette[i];
    document.getElementById("palette").innerHTML += '<button type="button" id="' + palette[i] + '" class="colorPick" onclick="changeColor(this.id)" style="background-color: rgb(' + palette[i] + ')"></button>';
    i++;
  }



}

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }


canvas.addEventListener('mousemove', function(evt) {

      var mousePos = getMousePos(canvas, evt);
      mouseX = mousePos.x -1;
      mouseY = mousePos.y -1;
      // mousePos.x + mousePos.y
}, false);

// Run
setInterval(update, 16);


// Hide cursor?
//document.body.style.cursor = 'none';


function update(){

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  mouseX = Math.floor(mouseX / 10);
  mouseX = mouseX * 10;

  mouseY = Math.floor(mouseY / 10);
  mouseY = mouseY * 10;



  var i = 0;
  while(i < pixels.length){
    ctx.fillStyle = "rgb(" + pixels[i].color + ")";
    ctx.fillRect(pixels[i].x, pixels[i].y, 10, 10);
    i++;
  }

  ctx.fillStyle = "rgba(" + color + ",.6)";
  ctx.fillRect(mouseX, mouseY, 10, 10);
}

// Place pixels user
canvas.addEventListener("click", function(){

  mouseX = Math.round(mouseX / 10);
  mouseX = mouseX * 10;

  mouseY = Math.round(mouseY / 10);
  mouseY = mouseY * 10;

  var  newPixel = {
    x: mouseX,
    y: mouseY,
    color: color
  };

  socket.emit("newpixel", newPixel);

});

// Update on new pixel
socket.on("update", function(pixel){
  pixels.push(pixel);
});

socket.on("cache", function(allPixels){
  pixels = allPixels;
});
