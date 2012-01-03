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
  console.log("setActive: " + active);
  this.active = active;
};

ZapperPainter.prototype.paint = function(renderer, layer) {
  if (!this.active) return; 
  if (layer == Vorp.LAYER_SPARKS) {
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.setFillStyle("rgba(255, 0, 0, " + (Math.random() * 0.15 + 0.4) + ")");
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

ZapperPainter.prototype.isKaput = function() {
  return !this.active;
};
