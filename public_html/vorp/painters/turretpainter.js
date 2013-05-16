/**
 * @constructor
 * @extends {Painter}
 */
function TurretPainter() {
  Painter.call(this, 1);
  this.lastFireTime = -Infinity;
}

TurretPainter.prototype = new Painter(1);
TurretPainter.prototype.constructor = TurretPainter;

TurretPainter.prototype.glowFraction = function(now) {
  return Math.min(1, (now - this.lastFireTime) / (1.5 * TurretSprite.COOLDOWN)) ;
};

TurretPainter.prototype.setLastFireTime = function(t) {
  this.lastFireTime = t;
};

TurretPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_MASSES) {
    var lite = Math.floor(255 -  128 * this.glowFraction(this.now));
    renderer.setFillStyle('rgb(' + lite + ', ' + lite + ', ' + lite + ')');
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

TurretPainter.prototype.isKaput = function() {
  // I promise: I will never die.
  return false;
};
