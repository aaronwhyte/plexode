/**
 * @constructor
 * @extends {Painter}
 */
function PortalPainter() {
  Painter.call(this, 1);
  this.kaput = false;

  this.twinPos = new Vec2d();
  this.towardsTwinPos = new Vec2d();
}

PortalPainter.prototype = new Painter();
PortalPainter.prototype.constructor = PortalPainter;

PortalPainter.PERSPECTIVE = 0.8;

PortalPainter.prototype.setTwinPos = function(twinPos) {
  this.twinPos.set(twinPos);
};

PortalPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
};

PortalPainter.prototype.paint = function(vorpOut, layer) {
  var e = this.events.getFromHead(0);
  e.moveToTime(this.now);
  vorpOut.setLineWidth(6);
  if (layer == Vorp.LAYER_MASSES) {
    vorpOut.setFillStyle('rgb(0, 223, 255)');
    vorpOut.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);

  } else if (layer == Vorp.LAYER_SPARKS) {
    var rad = e.rx;
    var radSum = 0;
    var t = this.towardsTwinPos.set(this.twinPos).addXY(-e.px, -e.py);
    for (var i = 1, n = 4; i < n; i++) {
      rad *= PortalPainter.PERSPECTIVE;
      radSum += rad;
      t.scaleToLength(radSum);
      vorpOut.setFillStyle('rgba(0, 223, 255, ' +  0.6 * (n - i) / n + ')');
      vorpOut.fillRectPosXYRadXY(e.px + t.x , e.py + t.y, rad , rad);
    }
  }
};

PortalPainter.prototype.isKaput = function() {
  return false;
};
