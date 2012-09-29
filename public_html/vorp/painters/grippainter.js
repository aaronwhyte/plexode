/**
 * @constructor
 * @extends {Painter}
 */
function GripPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.tractorBeamPainter = new TractorBeamPainter();
}
GripPainter.prototype = new Painter(1);
GripPainter.prototype.constructor = GripPainter;

GripPainter.prototype.addRayScan = function(rayScan) {
  if (Math.random() > 0.3) {
    return;
  }
  this.tractorBeamPainter.addRayScan(rayScan);
};

GripPainter.prototype.clearRayScans = function() {
  this.tractorBeamPainter.clearRayScans();
};

GripPainter.prototype.setHolderPos = function(pos) {
  this.tractorBeamPainter.setHolderPos(pos);
};

GripPainter.prototype.setHeldPos = function(pos) {
  this.tractorBeamPainter.setHeldPos(pos);
};

GripPainter.prototype.setHolding = function(str) {
  this.isHolding = true;
  this.tractorBeamPainter.setHolding(str);
};

GripPainter.prototype.setReleasing = function(kick) {
  this.isHolding = false;
  this.tractorBeamPainter.setReleasing(0);
};

GripPainter.prototype.advance = function(now) {
  this.now = now;
  this.tractorBeamPainter.advance(now);
};

GripPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    this.tractorBeamPainter.paint(renderer, layer);
  } else if (layer == Vorp.LAYER_MASSES) {
    renderer.setFillStyle(this.isHolding ? '#9f9' : '#7a7');
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

GripPainter.prototype.isKaput = function() {
  // They can't kill The Rooster.
  return false;
};
