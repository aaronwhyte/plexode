/**
 * @constructor
 * @extends {Painter}
 */
function TimerPainter() {
  Painter.call(this, 1);
}
TimerPainter.prototype = new Painter(1);
TimerPainter.prototype.constructor = TimerPainter;

TimerPainter.prototype.paint = function(renderer, layer) {
//  renderer.setFillStyle('#000');
//  e = this.events.getFromHead(0);
//  e.moveToTime(this.now);
//  renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
};

TimerPainter.prototype.isKaput = function() {
  // I promise: I will never die.
  return false;
};
