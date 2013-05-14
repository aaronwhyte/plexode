/**
 * @constructor
 * @extends {Painter}
 */
function ZombiePainter() {
  Painter.call(this, 1);
  this.dying = false;
}
ZombiePainter.prototype = new Painter();
ZombiePainter.prototype.constructor = ZombiePainter;

ZombiePainter.RGB = [100, 240, 100];
ZombiePainter.COLOR = 'rgb(' + ZombiePainter.RGB.join(',') + ')';

ZombiePainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_MASSES && !this.events.isEmpty()) {
    renderer.setFillStyle(ZombiePainter.COLOR);
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

ZombiePainter.prototype.isKaput = function() {
  return this.dying;
};

ZombiePainter.prototype.die = function() {
  this.dying = true;
};
