/**
 * @constructor
 * @extends {Painter}
 */
function PlasmaPainter() {
  Painter.call(this, 10);
  this.dying = false;
  this.kaput = false;
}
PlasmaPainter.prototype = new Painter(null);
PlasmaPainter.prototype.constructor = PlasmaPainter;

PlasmaPainter.TRAIL_TIMESPAN = 3;

PlasmaPainter.prototype.advance = function(now) {
  this.now = now;

  // Remove obsolete events
  while(this.events.size()) {
    if (this.events.getFromTail(0).time + PlasmaPainter.TRAIL_TIMESPAN < now) {
      PaintEvent.free(this.events.dequeue());
    } else {
      break;
    }
  }
};

PlasmaPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    vorpOut.beginPath();
    for (var s = 0; s < 2; s++) {
      var prevEvent = null;
      if (s) {
        vorpOut.setStrokeStyle('rgba(255, 0, 255, 0.4)');
        vorpOut.setLineWidth(PlasmaSprite.RADIUS * 4);
      } else {
        vorpOut.setStrokeStyle('rgba(255, 0, 255, 0.8)');
        vorpOut.setLineWidth(PlasmaSprite.RADIUS);
      }
      for (var i = 0, n = this.events.size(); i < n; i++) {
        var event = this.events.getFromTail(i);
        if (prevEvent) {
          prevEvent.moveToTime(event.startTime);
          vorpOut.lineTo(prevEvent.px, prevEvent.py);
        }
        event.moveToTime(event.startTime);
        vorpOut.moveTo(event.px, event.py);
        prevEvent = event;
      }
      vorpOut.stroke();
    }
  }
};

PlasmaPainter.prototype.isKaput = function() {
  return this.dying && this.events.isEmpty();
};

PlasmaPainter.prototype.die = function() {
  this.dying = true;
};
