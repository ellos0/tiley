

const cin = document.getElementById('cin');
const main = document.getElementById('main');
const drawcanv = document.getElementById("draw");
const mctx = main.getContext('2d');
const dctx = drawcanv.getContext("2d");
const bgcolor = "#ffffff";
const p = document.getElementById('p');
const spi = document.getElementById('spi');
const remi = document.getElementById('remi');

//settings!
const tilewidth = 20 * main.width/100;
const bigtilew = 5;
//variables
var colorse = 1;
var sprin = 0;
var sprites = [];
var colors = [bgcolor,"#000000"];

const pxbtw = bigtilew * tilewidth;


dctx.fillStyle = bgcolor;
dctx.fillRect(0,0,main.width,main.height);
mctx.fillStyle = bgcolor;
mctx.fillRect(0,0,main.width,main.height);
function drawRow(x,y,rowdata,con) {
  for (let i = 0; i < rowdata.length; i++) {
    let tchoice = con == mctx ? 0.2 : 1
    con.fillStyle = colors[rowdata[i]];
    con.fillRect(x*tchoice+i*tilewidth*tchoice, y*tchoice,tilewidth*tchoice,tilewidth*tchoice);
  }
}
function drawTexture(x,y,textdata,con) {
  for (let i = 0; i < textdata.length; i++) {
    drawRow(x,y+i*tilewidth,textdata[i],con);
  }
}
//tile system \/\/\/\/
function drawTile(gridx,gridy,data,con) {
  drawTexture(gridx * pxbtw, gridy * pxbtw, data,con);
}
function drawTileRow(gridx,gridy,data,con) {
  for (let i = 0; i < data.length; i++) {
    drawTile(gridx + i, gridy, data[i],con);
  }
}

//sprites are just holders for the darn images

class Sprite {
  constructor(d) {
    this.d = d;
  };
};
//sprite drawing
var curdr = [];
var fla = [];
// Correct initialization using independent arrays for each row
fla = Array(bigtilew).fill(0);
curdr = Array(bigtilew).fill(null).map(() => [...fla]);  // Create separate arrays for each row

console.log(curdr)

//mouse position calculating
function  getMousePos(evt) {
  var rect = drawcanv.getBoundingClientRect(), // abs. size of element
    scaleX = drawcanv.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = drawcanv.height / rect.height;  // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  };
};

function convertMousePos(t) {
  return {
    x: Math.floor(t.x / tilewidth),  // Use Math.floor instead of rounding for cleaner index
    y: Math.floor(t.y / tilewidth)   // Same for y
  };
};

var leftdown = false;

function setPrimaryButtonState(e) {
  var flags = e.buttons !== undefined ? e.buttons : e.which;
  leftdown = (flags & 1) === 1;
}
//keys
var keys = {};
   document.addEventListener("keydown", event => {
   keys[(event.key)] = true;
  });
  document.addEventListener('keyup', event =>{
    keys[(event.key)] = false;
  });
  function keyDown(key) {
    return keys[key];
  };
//draw
function draw(e) {
  if (leftdown) {
    let mousePos = convertMousePos(getMousePos(e));
    let x1 = mousePos.x <= bigtilew - 1 ? mousePos.x:-1;
    let y1 = mousePos.y <= bigtilew - 1 ? mousePos.y:-1;
    if (x1 != -1 && y1 != -1) {
      curdr[y1][x1]=1;
    };
    if (x1 >= 0 && x1 < bigtilew && y1 >= 0 && y1 < bigtilew) {
      // Set the current drawing cell to the selected color
      curdr[y1][x1] = colorse;
    }
  };
  drawTile(0,0,curdr,dctx);
};

document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);
document.addEventListener("mousemove",draw)

//palette
function colorClicked(i) {
  colorse = i;
};


function addColor(c,id) {
  let nw = document.createElement('div');
  nw.classList.add("c");
  nw.style["background-color"]=c;
  nw.addEventListener("click",function() {
    colorClicked(id)
  });
  p.appendChild(nw);
  return nw;
};
function logPalette(b,e) {
  p.innerHTML = "Palette";
  for (let i = b; i<e;i++) {
    addColor(colors[i],i)
  };
};
function addColorToPalette() {
  colors.push(cin.value);
  logPalette(0,colors.length);
};
//sprite selection
function loadSprite(i) {
  if (sprites[i] != undefined) {
    curdr = sprites[i];
  } else {
    sprites[i] = Array(bigtilew).fill(null).map(() => [...fla]); 
  };
  drawTile(0,0,curdr,dctx);
};
function saveSprite(i) {
  sprites[i] = curdr;
  curdr = Array(bigtilew).fill(null).map(() => [...fla]); 
};
function prevSprite() {
  saveSprite(sprin);
  if (sprin - 1 >= 0) {
    sprin -= 1;
  };
  spi.textContent = sprin;
  loadSprite(sprin);
};
function nextSprite() {
  saveSprite(sprin);
  sprin += 1
  spi.textContent = sprin;
  loadSprite(sprin);
};
//code running
// Function to execute JavaScript code from the textarea
function runUserCode() {
    // Get the JavaScript code from the textarea
    var code = document.getElementById('js').value;
    
    // Call the function to run the code
    executeCode(code);
}

// Function to execute the JavaScript code
function executeCode(code) {
    try {
        const func = new Function(code);
        func();  // Executes the code
    } catch (e) {
        console.error("Error executing code:", e);
    }
}


logPalette(0,colors.length);
