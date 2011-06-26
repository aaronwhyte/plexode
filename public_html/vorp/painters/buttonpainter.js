/**
 * @constructor
 * @extends {Painter}
 */
function ButtonPainter() {
  Painter.call(this, 1);
  this.lastClickTime = -Infinity;
}

ButtonPainter.prototype = new Painter(1);
ButtonPainter.prototype.constructor = ButtonPainter;

ButtonPainter.prototype.debounceFraction = function(now) {
  return Math.max(this.lastClickTime + ButtonSprite.DEBOUNCE - now, 0) /
      ButtonSprite.DEBOUNCE;
};

ButtonPainter.prototype.setLastClickTime = function(t) {
  this.lastClickTime = t;
};

ButtonPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_MASSES) {
    var val = Math.min(255, Math.floor(255 - 100 + this.debounceFraction(this.now) * 200));
    renderer.setFillStyle('rgb(' + val + ', ' + val + ', ' + val + ')');
    e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

ButtonPainter.prototype.isKaput = function() {
  // I promise: I will never die.
  return false;
};
