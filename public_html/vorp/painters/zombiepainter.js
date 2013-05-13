/**
 * @constructor
 * @extends {Painter}
 */
function ZombiePainter() {
  Painter.call(this, 1);
  this.kaput = false;
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

/**
 * @param {boolean} kaput
 */
ZombiePainter.prototype.setKaput = function(kaput) {
  this.kaput = kaput;
};

ZombiePainter.prototype.isKaput = function() {
  return this.kaput;
};
