
// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");



function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

canvas.addEventListener('mousemove', function(evt) {


      var mousePos = getMousePos(canvas, evt);

      ctx.fillStyle = "blue";
      ctx.fillRect(mousePos.x, mousePos.y, 10, 10);

      // mousePos.x + mousePos.y
}, false);








// Run
setInterval(update(), 16);

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function update(){


}
