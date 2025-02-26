// DOM Elements with Chaos Naming
const cin = document.getElementById('cin');        // Color Input
const main = document.getElementById('main');     // Main Canvas
const drawcanv = document.getElementById("draw"); // Drawing Canvas
const mctx = main.getContext('2d', { alpha: false });    // Main Context
const dctx = drawcanv.getContext("2d", { alpha: false }); // Draw Context
const p = document.getElementById('p');           // Palette Container
const spi = document.getElementById('spi');       // Sprite Index Display
const remi = document.getElementById('remi');     // Reset Button (assuming it exists)

// Settings with Chaos Config
const bgcolor = "#ffffff";                        // Default Glow
const tilewidth = 20 * main.width / 100;          // Tile Width (% Chaos)
const bigtilew = 5;                               // Grid Size (Chaos Grid)
const pxbtw = bigtilew * tilewidth;              // Pixel Between Tiles
const maxSprites = 100;                           // Sprite Cap (#GlowCoup Scale)

// Variables with Chaos State
let colorse = 1;                                  // Selected Color Index
let sprin = 0;                                    // Current Sprite Index
let sprites = [];                                 // Sprite Chaos Array
let colors = [bgcolor, "#000000"];               // Initial Chaos Palette
let curdr = [];                                   // Current Drawing Grid
let fla = Array(bigtilew).fill(0);               // Default Fill Array
curdr = Array(bigtilew).fill(null).map(() => [...fla]); // Chaos Grid Init

// Canvas Initialization with Glow Chaos
function initCanvas(ctx, width, height) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false; // Crisp Chaos Pixels
}

initCanvas(mctx, main.width, main.height);
initCanvas(dctx, drawcanv.width, drawcanv.height);

// Drawing Functions with Chaos Precision
function drawRow(x, y, rowdata, con, scale = 1) {
    for (let i = 0; i < rowdata.length; i++) {
        con.fillStyle = colors[rowdata[i]] || bgcolor;
        con.fillRect(x * scale + i * tilewidth * scale, y * scale, tilewidth * scale, tilewidth * scale);
    }
}

function drawTexture(x, y, textdata, con, scale = 1) {
    for (let i = 0; i < textdata.length; i++) {
        drawRow(x, y + i * tilewidth * scale, textdata[i], con, scale);
    }
}

function drawTile(gridx, gridy, data, con, scale = 1) {
    drawTexture(gridx * pxbtw, gridy * pxbtw, data, con, scale);
}

function drawTileRow(gridx, gridy, data, con) {
    for (let i = 0; i < data.length; i++) {
        drawTile(gridx + i, gridy, data[i], con);
    }
}

// Sprite Class with Chaos Storage
class Sprite {
    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data)); // Deep Chaos Copy
        this.timestamp = Date.now(); // Chaos Creation Time
    }

    clone() {
        return new Sprite(this.data); // Clone Chaos
    }
}

// Mouse Handling with Chaos Precision
let leftdown = false;

function getMousePos(evt) {
    const rect = drawcanv.getBoundingClientRect();
    const scaleX = drawcanv.width / rect.width;
    const scaleY = drawcanv.height / rect.height;
    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
}

function convertMousePos(t) {
    return {
        x: Math.floor(t.x / tilewidth),
        y: Math.floor(t.y / tilewidth)
    };
}

function setPrimaryButtonState(e) {
    const flags = e.buttons !== undefined ? e.buttons : e.which;
    leftdown = (flags & 1) === 1;
}

function draw(e) {
    if (!leftdown) return;
    const mousePos = convertMousePos(getMousePos(e));
    const x1 = Math.min(Math.max(mousePos.x, 0), bigtilew - 1);
    const y1 = Math.min(Math.max(mousePos.y, 0), bigtilew - 1);
    curdr[y1][x1] = colorse;
    drawTile(0, 0, curdr, dctx);
    triggerGlowAnimation(x1, y1); // #BlazeRush Glow Chaos
}

// Event Listeners with Chaos Reactivity
document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);
document.addEventListener("mousemove", draw);

// Palette Handling with Chaos Flair
function colorClicked(i) {
    colorse = i;
    animatePaletteSelection(i); // #GlowVortex Glow
}

function addColor(c, id) {
    const nw = document.createElement('div');
    nw.classList.add("c");
    nw.style.backgroundColor = c;
    nw.dataset.colorId = id;
    nw.addEventListener("click", () => colorClicked(id));
    p.appendChild(nw);
    return nw;
}

function logPalette(start = 0, end = colors.length) {
    p.innerHTML = "<h3>Palette Chaos</h3>";
    for (let i = start; i < end; i++) {
        addColor(colors[i], i);
    }
}

function addColorToPalette() {
    const newColor = cin.value.trim();
    if (newColor && !colors.includes(newColor)) {
        colors.push(newColor);
        logPalette();
        localStorage.setItem('chaosColors', JSON.stringify(colors)); // Persist Chaos
    }
}

// Sprite Management with Chaos Persistence
function loadSprite(i) {
    if (i < 0 || i >= maxSprites) return;
    if (!sprites[i]) {
        sprites[i] = new Sprite(Array(bigtilew).fill(null).map(() => [...fla]));
    }
    curdr = JSON.parse(JSON.stringify(sprites[i].data)); // Deep Chaos Copy
    drawTile(0, 0, curdr, dctx);
    spi.textContent = sprin;
    saveStateToUndo(); // #GlowCoup Undo Chaos
}

function saveSprite(i) {
    if (i < 0 || i >= maxSprites) return;
    sprites[i] = new Sprite(curdr);
    localStorage.setItem('chaosSprites', JSON.stringify(sprites.filter(s => s))); // Persist Chaos
}

function prevSprite() {
    saveSprite(sprin);
    if (sprin > 0) {
        sprin--;
        loadSprite(sprin);
    }
}

function nextSprite() {
    saveSprite(sprin);
    sprin = Math.min(sprin + 1, maxSprites - 1);
    loadSprite(sprin);
}

// New Feature: Undo/Redo Chaos
let undoStack = [];
let redoStack = [];

function saveStateToUndo() {
    undoStack.push(JSON.stringify(curdr));
    if (undoStack.length > 20) undoStack.shift(); // Limit Chaos History
    redoStack = []; // Reset Redo on New Action
}

function undo() {
    if (undoStack.length <= 1) return;
    redoStack.push(undoStack.pop());
    curdr = JSON.parse(undoStack[undoStack.length - 1]);
    drawTile(0, 0, curdr, dctx);
}

function redo() {
    if (redoStack.length === 0) return;
    curdr = JSON.parse(redoStack.pop());
    undoStack.push(JSON.stringify(curdr));
    drawTile(0, 0, curdr, dctx);
}

// New Feature: Glow Animation on Draw
function triggerGlowAnimation(x, y) {
    const glow = document.createElement('div');
    glow.className = 'glow-effect';
    glow.style.left = `${x * tilewidth}px`;
    glow.style.top = `${y * tilewidth}px`;
    drawcanv.parentElement.appendChild(glow);
    setTimeout(() => glow.remove(), 300); // #BlazeRush Glow Chaos
}

// New Feature: Palette Animation
function animatePaletteSelection(index) {
    const paletteItems = p.getElementsByClassName('c');
    if (paletteItems[index]) {
        paletteItems[index].classList.add('selected-glow');
        setTimeout(() => paletteItems[index].classList.remove('selected-glow'), 500);
    }
}

// New Feature: Export/Import Chaos
function exportChaos() {
    const chaosData = {
        sprites: sprites.filter(s => s),
        colors: colors,
        current: curdr,
        sprin: sprin
    };
    const blob = new Blob([JSON.stringify(chaosData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chaos_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importChaos(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        sprites = data.sprites.map(s => new Sprite(s.data));
        colors = data.colors;
        curdr = data.current;
        sprin = data.sprin;
        logPalette();
        drawTile(0, 0, curdr, dctx);
        spi.textContent = sprin;
    };
    reader.readAsText(file);
}

// New Feature: Dynamic Grid Resize
function resizeGrid(newSize) {
    if (newSize < 1 || newSize > 20) return; // Chaos Limits
    bigtilew = newSize;
    fla = Array(bigtilew).fill(0);
    curdr = Array(bigtilew).fill(null).map(() => [...fla]);
    drawTile(0, 0, curdr, dctx);
    saveStateToUndo();
}

// Code Execution with Chaos Context
function runUserCode() {
    const code = document.getElementById('js')?.value || '';
    try {
        const func = new Function('stream', 'dctx', 'curdr', 'colors', 'sprites', code);
        func(this, dctx, curdr, colors, sprites); // Chaos Context
    } catch (e) {
        console.error("Chaos Code Error:", e);
    }
}

// Initialization with Chaos Persistence
function initChaos() {
    const savedColors = localStorage.getItem('chaosColors');
    const savedSprites = localStorage.getItem('chaosSprites');
    if (savedColors) colors = JSON.parse(savedColors);
    if (savedSprites) sprites = JSON.parse(savedSprites).map(s => new Sprite(s.data));
    logPalette();
    loadSprite(sprin);
}

// Event Bindings
document.getElementById('prev')?.addEventListener('click', prevSprite);
document.getElementById('next')?.addEventListener('click', nextSprite);
document.getElementById('addColor')?.addEventListener('click', addColorToPalette);
document.getElementById('runCode')?.addEventListener('click', runUserCode);
document.getElementById('undo')?.addEventListener('click', undo);
document.getElementById('redo')?.addEventListener('click', redo);
document.getElementById('export')?.addEventListener('click', exportChaos);
document.getElementById('import')?.addEventListener('change', importChaos);
document.getElementById('resize')?.addEventListener('change', (e) => resizeGrid(parseInt(e.target.value)));

// Kickoff Chaos
initChaos();
