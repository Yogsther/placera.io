
// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var mouseX;
var mouseY;

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }


canvas.addEventListener('mousemove', function(evt) {

      var mousePos = getMousePos(canvas, evt);

      mouseX = mousePos.x;
      mouseY = mousePos.y;
      // mousePos.x + mousePos.y
}, false);


// Run
setInterval(update, 16);




function update(){

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  mouseX = mouseX / 10;
  mouseY = mouseY / 10;

  mouseX = Math.floor(mouseX);
  mouseY = Math.floor(mouseY);

  mouseX = mouseX * 10;
  mouseY = mouseY * 10;

  ctx.fillStyle = "black";
  ctx.fillRect(mouseX, mouseY, 10, 10);

  console.log("update");

}
