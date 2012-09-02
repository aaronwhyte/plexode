/**
 * @constructor
 * @extends {Painter}
 */
function PlayerPainter() {
  FLAGS && FLAGS.init('playerTrail', false);
  Painter.call(this, 600);
  this.dying = false;
  this.kaput = false;
  this.tractorBeamPainter = new TractorBeamPainter();
}
PlayerPainter.prototype = new Painter(1);
PlayerPainter.prototype.constructor = PlayerPainter;

PlayerPainter.TRAIL_TIMESPAN = 200;

PlayerPainter.prototype.addRayScan = function(rayScan) {
  if (Math.random() > 0.2) {
    return;
  }
  this.tractorBeamPainter.addRayScan(rayScan);
};

PlayerPainter.prototype.clearRayScans = function() {
  this.tractorBeamPainter.clearRayScans();
};

PlayerPainter.prototype.setHolderPos = function(pos) {
  this.tractorBeamPainter.setHolderPos(pos);
};

PlayerPainter.prototype.setHeldPos = function(pos) {
  this.tractorBeamPainter.setHeldPos(pos);
};

PlayerPainter.prototype.setHolding = function(str) {
  this.tractorBeamPainter.setHolding(str);
};

PlayerPainter.prototype.setReleasing = function(kick) {
  this.tractorBeamPainter.setReleasing(kick);
};

PlayerPainter.prototype.advance = function(now) {
  this.now = now;
  this.tractorBeamPainter.advance(now);
  
  // Remove obsolete events
  while(this.events.size()) {
    if (this.events.getFromTail(0).time + PlayerPainter.TRAIL_TIMESPAN < now) {
      PaintEvent.free(this.events.dequeue());
    } else {
      break;
    }
  }
  //this.clearPoly();
};

PlayerPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    this.tractorBeamPainter.paint(renderer, layer);
    if ((FLAGS && FLAGS.get('playerTrail'))) {
      var prevEvent = null;
      renderer.context.beginPath();
      renderer.setStrokeStyle('rgba(255, 68, 221, 0.5)');
      renderer.context.lineWidth = 10;
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
  } else if (layer == Vorp.LAYER_MASSES && !this.dying && !this.events.isEmpty()) {
    renderer.setFillStyle('rgb(255, 68, 221)');
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

PlayerPainter.prototype.isKaput = function() {
  // They *can* kill The Rooster.  Just not for more than a second.
  return this.dying && this.events.isEmpty() && this.tractorBeamPainter.isEmpty();
};

PlayerPainter.prototype.die = function() {
  this.dying = true;
};
