/**
 * @constructor
 * @extends {Painter}
 */
function ZapperPainter(active) {
  Painter.call(this, 1);
  this.active = active;
}

ZapperPainter.prototype = new Painter(1);
ZapperPainter.prototype.constructor = ZapperPainter;

ZapperPainter.prototype.setActive = function(active) {
  this.active = active;
};

ZapperPainter.prototype.paint = function(vorpOut, layer) {
  if (!this.active) return;
  if (layer == Vorp.LAYER_SUPERSPARKS) {
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    vorpOut.setFillStyle('rgba(' +
        (Math.floor(Math.random() * 55) + 150) + ',' +
        0 + ',' +
        (Math.floor(Math.random() * 55) + 170) + ',' +
        (Math.random() * 0.15 + 0.6) +
        ')');
    vorpOut.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

ZapperPainter.prototype.isKaput = function() {
  return !this.active;
};
