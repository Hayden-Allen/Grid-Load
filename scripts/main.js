let Global = {
  c: document.getElementById("c"),  //canvas
  ctx: c.getContext("2d"),  //canvas draw context
  fps: 60,  //frames per second
  keys: new BitSet(0),  //keeps track of which keys are pressed
  tilesize: 40, //width and height of each tile

  Key: {  //indices for keys
    w: 3,
    a: 2,
    s: 1,
    d: 0
  },
  Colors: [ //possible tile colors
    "#aa0000",
    "#00aa00",
    "#0000aa",
    "#aaaa00",
    "#00aaaa"
  ],

  rect: function(x, y, w, h, color){  //draw a filled rectangle at (x, y)
    Global.ctx.fillStyle = color;
    Global.ctx.fillRect(x, y, w, h);
  },
  clamp: function(x, min, max){ //clamps x to [min, max]
    return Math.min(max, Math.max(x, min));
  }
}
Global.c.width = Global.tilesize * 15;  //canvas is 15 tiles wide
Global.c.height = Global.tilesize * 15; //canvas is 15 tiles tall
Global.c.style = "border: 1px solid black;";  //black border around canvas

function grid(w, h){  //create grid of tiles with dimensions wxh
  var arr = [];
  for(var i = 0; i < h; i++){ //for each row
    arr.push([]); //create new row
    for(var j = 0; j < w; j++){ //for each column
      arr[i].push(parseInt(Math.random() * (Global.Colors.length)));  //create new tile with random color
    }
  }
  return arr;
}
let pos = {x: 7, y: 7}, range = 7;  //starting position of player, radius of renderer
let g = grid(100, 100); //create new grid

function render(g){
  let size = Global.tilesize;
  //radial occlusion culling algorithm
  //using equation: x^2 + y^2 = r^2
  //
  //begin on left side of circle; that is, x = -radius
  //iterate through until right side is reached, or x = radius
  //
  //for each iteration, calculate y boundary: y = sqrt(r^2 - x^2)
  //loop through from top to bottom; from y to -y
  //
  //clamp current position to grid
  //if current position is player position, draw pink rectangle
  //otherwise, draw rectangle from the grid
  for(var x = -range; x <= range; x++){
    let y = parseInt((Math.sqrt(range * range - x * x + 1)));
    for(var i = y; i >= -y; i--){
      let ry = Global.clamp(pos.y - i, 0, g.length - 1);
      let rx = Global.clamp(pos.x - x, 0, g[ry].length - 1);
      if(rx == pos.x && ry == pos.y)
        Global.rect(Math.round(Global.c.width / 2 - size / 2), Math.round(Global.c.height / 2 - size / 2), size, size, "#ff00ff");
      else
        Global.rect(Math.round(Global.c.width / 2 - pos.x * size - size / 2) + rx * size,
                    Math.round(Global.c.height / 2 - pos.y * size - size / 2) + ry * size, size, size, Global.Colors[g[ry][rx]]);
    }
  }
}


function update(){  //game loop
  Global.ctx.clearRect(0, 0, Global.c.width, Global.c.height);  //clear sceen

  render(g);  //draw grid

  //update player position
  pos.y += (Global.keys.at(Global.Key.s) - Global.keys.at(Global.Key.w)) * 1;
  pos.x += (Global.keys.at(Global.Key.d) - Global.keys.at(Global.Key.a)) * 1;
  //clamp player position to grid
  pos.y = Global.clamp(pos.y, 0, g.length - 1);
  pos.x = Global.clamp(pos.x, 0, g[pos.y].length - 1);

  setTimeout(update, 1000 / Global.fps);  //wait for next frame
}
update();

//handle keyboard input and update Global.keys
window.onkeydown = function(e){
  switch(e.keyCode){
  case 87: Global.keys.set(Global.Key.w); break;
  case 65: Global.keys.set(Global.Key.a); break;
  case 83: Global.keys.set(Global.Key.s); break;
  case 68: Global.keys.set(Global.Key.d); break;
  }
}
window.onkeyup = function(e){
  switch(e.keyCode){
  case 87: Global.keys.reset(Global.Key.w); break;
  case 65: Global.keys.reset(Global.Key.a); break;
  case 83: Global.keys.reset(Global.Key.s); break;
  case 68: Global.keys.reset(Global.Key.d); break;
  }
}
