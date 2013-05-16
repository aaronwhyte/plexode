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
PlasmaPainter.LINE_WIDTH = 5;

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

PlasmaPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    var prevEvent = null;
    renderer.context.beginPath();
    for (var s = 0; s < 2; s++) {
      if (s) {
        renderer.setStrokeStyle('rgba(255, 0, 255, 0.4)');
        renderer.context.lineWidth = PlasmaPainter.LINE_WIDTH * 4;
      } else {
        renderer.setStrokeStyle('rgb(255, 0, 255)');
        renderer.context.lineWidth = PlasmaPainter.LINE_WIDTH;
      }
      for (var i = 0, n = this.events.size(); i < n; i++) {
        var event = this.events.getFromTail(i);
        if (prevEvent) {
          prevEvent.moveToTime(event.startTime);
          renderer.context.lineTo(prevEvent.px, prevEvent.py);
        }
        event.moveToTime(event.startTime);
        renderer.context.moveTo(event.px, event.py);
        prevEvent = event;
      }
      renderer.context.stroke();
    }
  }
};

PlasmaPainter.prototype.isKaput = function() {
  return this.dying && this.events.isEmpty();
};

PlasmaPainter.prototype.die = function() {
  this.dying = true;
};
