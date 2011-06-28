/**
 * @constructor
 * @extends {Painter}
 */
function BeamerPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.beamEnd = new Vec2d();
}
BeamerPainter.prototype = new Painter(1);
BeamerPainter.prototype.constructor = BeamerPainter;

BeamerPainter.prototype.setBeamEndXY = function(x, y) {
  this.beamEnd.setXY(x, y);
};

BeamerPainter.prototype.advance = function(now) {
  this.now = now;
};

BeamerPainter.prototype.paint = function(renderer, layer) {
  var e = this.events.getFromHead(0);
  e.moveToTime(this.now);
  if (layer == Vorp.LAYER_SPARKS) {
    renderer.context.lineWidth = Math.random() + 1.5;
    renderer.setStrokeStyle('rgb(200, 0, 0)');
    renderer.drawLineXYXY(e.px, e.py, this.beamEnd.x, this.beamEnd.y);
  } else if (layer == Vorp.LAYER_MASSES) {
    renderer.setFillStyle('rgb(128, 128, 128)');
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

BeamerPainter.prototype.isKaput = function() {
  // They can't kill The Rooster.
  return false;
};
