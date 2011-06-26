/**
 * Renders all of Fracas2 using an HTML5 canvas.
 * @constructor
 */
function Renderer(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.context.font = "bold 14px monospace";
  this.context.lineWidth = 2;
  this.canvasWidth = this.canvas.width;
  this.canvasHeight = this.canvas.height;
  this.lastTimeSec = (new Date()).getTime() / 1000;
  this.frameCount = 0;
  this.fps = 0;
  this.fillStyle = "";
  this.posVec = new Vec2d();
  this.radVec = new Vec2d();
}

Renderer.prototype.start = function(
    zoom,
    worldX,
    worldY) {
  this.frameCount++;
  if (this.frameCount >= 30) {
    var newTimeSec = (new Date()).getTime() / 1000;
    this.fps = Math.round(this.frameCount / (newTimeSec - this.lastTimeSec));
    this.lastTimeSec = newTimeSec;
    this.frameCount = 0;
  }
  var c = this.context;
  c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  c.save();

  // go to middle of canvas
  c.translate(this.canvasWidth/2, this.canvasHeight/2);
  // zoom
  c.scale(zoom, zoom);
  // center on world coords
  c.translate(-worldX, -worldY);
};

Renderer.prototype.end = function() {
  var c = this.context;
  c.restore();

  c.textBaseline = "top";
  c.textSize = "14pt";
  this.setFillStyle("white");
  c.fillText(this.fps + ' ' + GU_nextDelay, 2, 2);
};

Renderer.prototype.setFillStyle = function(style) {
  if (this.fillStyle !== style) {
    this.fillStyle = style;
    this.context.fillStyle = style;
  }
};

/**
 * @param {Sprite} s
 */
Renderer.prototype.drawSprite = function(s) {
  var p = s.getPos(this.posVec);
  var r = s.getRad(this.radVec);
  this.context.fillRect(
      p.x - r.x, p.y - r.y,
      r.x * 2, r.y * 2);
};

Renderer.prototype.drawLine = function(c, x0, y0, x1, y1) {
  this.context.beginPath();
  this.context.strokeStyle = c;
  this.context.moveTo(x0, y0);
  this.context.lineTo(x1, y1);
  this.context.stroke();
};

Renderer.prototype.drawMark = function(mark) {
  switch (mark.type) {
    case Mark.Type.DRAWRECT:
      this.context.strokeStyle = mark.style;
      this.context.strokeRect(mark.x0, mark.y0, mark.x1 - mark.x0, mark.y1 - mark.y0);
      break;
    case Mark.Type.FILLRECT:
      this.setFillStyle(mark.style);
      this.context.fillRect(mark.x0, mark.y0, mark.x1, mark.y1);
      break;
    case Mark.Type.LINE:
      this.context.beginPath();
      this.context.strokeStyle = mark.style;
      this.context.moveTo(mark.x0, mark.y0);
      this.context.lineTo(mark.x1, mark.y1);
      this.context.stroke();
      break;
  }
};

Renderer.prototype.drawGrid = function(x, y, w, h, xCells, yCells) {
  this.context.beginPath();
  this.context.lineWidth = 1;
  this.context.strokeStyle = '#f00';
  var cellWidth = w / xCells;
  for (var i = 0; i <= xCells; i++) {
    var xx = x + i * cellWidth;
    this.context.moveTo(xx, y);
    this.context.lineTo(xx, y + h);
  }
  var cellHeight = h / yCells;
  for (var i = 0; i <= yCells; i++) {
    var yy = y + i * cellHeight;
    this.context.moveTo(x, yy);
    this.context.lineTo(x + w, yy);
  }
  this.context.stroke();
};

var cc;
Renderer.prototype.drawGnome = function(sledge, now) {
  cc = this.context;
  var t = (new Date()).getTime() / 100;
  cc.lineWidth = 0.1;
  cc.strokeStyle = "#000";
  cc.save();
  cc.translate(sledge.px, sledge.py);
  cc.rotate(Math.sin(t*0.8)* 0.1);
  cc.scale(sledge.rx, sledge.ry);
  body();
  arms(t);
  legs(t);
  beard();
  nose();
  eyes();
  mouth();
  hat();
  cc.restore();
};

function body() {
  cc.fillStyle="#fdd";
  cc.beginPath();
  cc.moveTo(-1, -1);
  cc.lineTo(1, -1);
  cc.lineTo(1, 0.9);
  cc.lineTo(-1, 0.9);
  cc.closePath();
  cc.fill();
  cc.stroke();
}

function beard() {
  cc.fillStyle="#ddd";
  cc.beginPath();
  cc.moveTo(-1.1, 0.9);
  cc.lineTo(-1.1, 0);
  cc.lineTo(0, -0.1);
  cc.lineTo(1.1, 0);
  cc.lineTo(1.1, 0.9);
  cc.lineTo(0, 1.1);
  cc.closePath();
  cc.fill();
  cc.stroke();
}

function eyes() {
  cc.fillStyle="#000";
  cc.beginPath();
  cc.arc(-0.5, -0.5, 0.08, 0, -0.001, false);
  cc.closePath();
  cc.fill();
  cc.stroke();
  cc.beginPath();
  cc.arc(0.5, -0.5, 0.08, 0, -0.001, false);
  cc.closePath();
  cc.fill();
  cc.stroke();
}

function nose() {
  cc.beginPath();
  cc.fillStyle="#fdd";
  cc.arc(0, -0.25, 0.27, 0-0.4, Math.PI+0.4, false);
  cc.fill();
  cc.stroke();
}

function mouth() {
  cc.beginPath();
  cc.moveTo(-0.4, 0.3);
  cc.lineTo(0.4, 0.3);
  cc.stroke();
}

function hat() {
  cc.fillStyle="#f00";
  cc.beginPath();
  cc.moveTo(-1.15, -0.8);
  cc.lineTo(0, -2.7);
  cc.lineTo(1.15, -0.8);
  cc.closePath();
  cc.fill();
  cc.stroke();
}

function arm() {
  cc.beginPath();
  cc.moveTo(0, 0);
  cc.quadraticCurveTo(0.5, 0.1, 0.6, 0.6);
  cc.stroke();
  cc.beginPath();
  cc.arc(0.6, 0.8, 0.2, -Math.PI, 1, false);
  cc.stroke();
}

function arms(t) {
  cc.save();
  cc.lineWidth = 0.15;
  cc.translate(1, 0.1);
  cc.rotate(Math.sin(t*0.6) / 2 - 0.4);
  arm();
  cc.restore();
  cc.save();
  cc.lineWidth = 0.15;
  cc.scale(-1, 1);
  cc.translate(1, 0.1);
  cc.rotate(Math.sin(t*0.65) / 2 - 0.4);
  arm();
  cc.restore();
}

function leg() {
  cc.beginPath();
  cc.moveTo(0, 0);
  cc.quadraticCurveTo(0.2, 0.4, 0.1, 0.8);
  cc.lineTo(0.5, 0.9);
  cc.stroke();
}

function legs(t) {
  cc.save();
  cc.lineWidth= 0.15;
  cc.save();
  cc.translate(0.5, 0.9);
  cc.rotate(Math.sin(t) / 2);
  leg();
  cc.restore();
  cc.save();
  cc.scale(-1, 1);
  cc.translate(0.5, 0.9);
  cc.rotate(Math.sin(t*1.02)/2);
  leg();
  cc.restore();
  cc.restore();
}
