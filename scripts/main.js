let Global = {
  c: document.getElementById("c"),
  ctx: c.getContext("2d"),
  fps: 60,
  keys: new BitSet(0),
  tilesize: 40,

  Key: {
    w: 3,
    a: 2,
    s: 1,
    d: 0
  },
  Colors: [
    "#aa0000",
    "#00aa00",
    "#0000aa",
    "#aaaa00",
    "#00aaaa"
  ],

  rect: function(x, y, w, h, color){
    Global.ctx.fillStyle = color;
    Global.ctx.fillRect(x, y, w, h);
  },
  clamp: function(x, min, max){
    return Math.min(max, Math.max(x, min));
  }
}
Global.c.width = Global.tilesize * 15;
Global.c.height = Global.tilesize * 15;
Global.c.style = "border: 1px solid black;";

function grid(w, h){
  var arr = [];

  for(var i = 0; i < h; i++){
    arr.push([]);
    for(var j = 0; j < w; j++){
      arr[i].push(parseInt(Math.random() * (Global.Colors.length)));//i % 2 + j % 2 != 1 ? 0 : 1);
    }
  }

  return arr;
}
let pos = {x: 7, y: 7}, range = 7;
let g = grid(100, 100);

function render(g){
  let size = Global.tilesize;
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


function update(){
  Global.ctx.clearRect(0, 0, Global.c.width, Global.c.height);

  render(g);

  pos.y += (Global.keys.at(Global.Key.s) - Global.keys.at(Global.Key.w)) * 1;//Global.clamp(pos.y - 1, 0, g.length - 1);
  pos.x += (Global.keys.at(Global.Key.d) - Global.keys.at(Global.Key.a)) * 1;
  pos.y = Global.clamp(pos.y, 0, g.length - 1);
  pos.x = Global.clamp(pos.x, 0, g[pos.y].length - 1);

  setTimeout(update, 1000 / Global.fps);
}
update();

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


function dijkstras(){

}
