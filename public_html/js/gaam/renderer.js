/**
 * Renders to a canvas using a Camera object to pan and zoom.
 * @param canvas
 * @param {Camera} camera
 * @constructor
 */
function Renderer(canvas, camera) {
  this.canvas = canvas;
  this.camera = camera;

  this.context = canvas.getContext('2d');
  this.context.textBaseline = 'top';
  this.lastTimeSec = (new Date()).getTime() / 1000;
  this.frameCount = 0;
  this.fps = 0;
}

Renderer.prototype.setCenter = function(x, y) {
  this.camera.setPanXY(x, y);
};

Renderer.prototype.setZoom = function(zoom) {
  this.camera.setZoom(zoom);
};

Renderer.prototype.scaleZoom = function(factor) {
  this.camera.setZoom(this.camera.getZoom() * factor);
};

Renderer.prototype.addPan = function(vec) {
  this.camera.setPanXY(
      this.camera.getPanX() + vec.x,
      this.camera.getPanY() + vec.y);
};

Renderer.prototype.getZoom = function() {
  return this.camera.getZoom();
};

Renderer.prototype.getPan = function() {
  return this.camera.getPan();
};

Renderer.prototype.getCanvasHeight = function() {
  return this.canvas.height;
};

Renderer.prototype.getCanvasWidth = function() {
  return this.canvas.width;
};

Renderer.prototype.getCanvasPageX = function() {
  return this.canvas.offsetLeft + this.canvas.clientLeft;
};

Renderer.prototype.getCanvasPageY = function() {
  return this.canvas.offsetTop + this.canvas.clientTop;
};


Renderer.prototype.setCanvasWidthHeight = function(w, h) {
  this.canvas.width = w;
  this.canvas.height = h;
};

Renderer.prototype.clear = function() {
  var c = this.context;
  c.clearRect(0, 0, this.canvas.width, this.canvas.height);
//  this.setFillStyle('rgba(0, 0, 0, 0.1)');
//  c.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

Renderer.prototype.transformStart = function() {
  var c = this.context;
  c.save();
  c.translate(this.canvas.width/2, this.canvas.height/2);
  var zoom = this.camera.getZoom();
  c.scale(zoom, zoom);
  c.translate(-this.camera.getPanX(), -this.camera.getPanY());
};

Renderer.prototype.transformEnd = function() {
  this.context.restore();
};

Renderer.prototype.stats = function() {
  var c = this.context;
  this.frameCount++;
  if (this.frameCount >= 30) {
    var newTimeSec = (new Date()).getTime() / 1000;
    this.fps = Math.round(this.frameCount / (newTimeSec - this.lastTimeSec));
    this.lastTimeSec = newTimeSec;
    this.frameCount = 0;
  }
  c.restore();
  this.setFillStyle('#555');
  c.font = 'bold 15px monospace';
  c.fillText(this.fps, 10, 20);
};

Renderer.prototype.setFillStyle = function(style) {
  this.context.fillStyle = style;
};

Renderer.prototype.setStrokeStyle = function(style) {
  this.context.strokeStyle = style;
};

Renderer.prototype.fillRectSprite = function(s) {
  var p = s.getPos(Vec2d.alloc());
  this.context.fillRect(
      p.x - s.rx, p.y - s.ry,
      s.rx * 2, s.ry * 2);
  Vec2d.free(p);
};

Renderer.prototype.strokeRectSprite = function(s) {
  var p = s.getPos(Vec2d.alloc());
  this.context.strokeRect(
      p.x - s.rx, p.y - s.ry,
      s.rx * 2, s.ry * 2);
  Vec2d.free(p);
};

Renderer.prototype.fillRectPosXYRadXY = function(px, py, rx, ry) {
  this.context.fillRect(
      px - rx, py - ry,
      rx * 2, ry * 2);
};

Renderer.prototype.strokeRectPosXYRadXY = function(px, py, rx, ry) {
  this.context.strokeRect(
      px - rx, py - ry,
      rx * 2, ry * 2);
};

Renderer.prototype.strokeRectCornersXYXY = function(x0, y0, x1, y1) {
  this.context.strokeRect(x0, y0, x1 - x0, y1 - y0);
};

Renderer.prototype.strokeCirclePosXYRad = function(px, py, r) {
  this.context.beginPath();
  this.context.arc(px, py, r, 0, Math.PI * 2);
  this.context.stroke();
};

Renderer.prototype.drawLineXYXY = function(x0, y0, x1, y1) {
  this.context.beginPath();
  this.context.moveTo(x0, y0);
  this.context.lineTo(x1, y1);
  this.context.stroke();
};

Renderer.prototype.drawLineVV = function(v0, v1) {
  this.context.beginPath();
  this.context.moveTo(v0.x, v0.y);
  this.context.lineTo(v1.x, v1.y);
  this.context.stroke();
};

Renderer.prototype.drawMark = function(mark) {
  this.context.lineWidth = 4;
  switch (mark.type) {
    case Mark.Type.DRAWRECT:
      this.setStrokeStyle(mark.style);
      this.context.strokeRect(mark.x0, mark.y0, mark.x1 - mark.x0, mark.y1 - mark.y0);
      break;
    case Mark.Type.FILLRECT:
      this.setFillStyle(mark.style);
      this.context.fillRect(mark.x0, mark.y0, mark.x1, mark.y1);
      break;
    case Mark.Type.LINE:
      this.context.beginPath();
      this.setStrokeStyle(mark.style);
      this.context.moveTo(mark.x0, mark.y0);
      this.context.lineTo(mark.x1, mark.y1);
      this.context.stroke();
      break;
  }
};
