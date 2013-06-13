/**
 * @constructor
 * @extends {Painter}
 */
function TimerPainter() {
  Painter.call(this, 1);
}
TimerPainter.prototype = new Painter(1);
TimerPainter.prototype.constructor = TimerPainter;

TimerPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_EDIT) {
  }
};

TimerPainter.prototype.isKaput = function() {
  // I promise: I will never die.
  return false;
};
