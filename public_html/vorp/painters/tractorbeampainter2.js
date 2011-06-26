/**
 * @constructor
 * @extends {Painter}
 */
function TractorBeamPainter() {
  FLAGS && FLAGS.init('tractorRangePoly', true);
  Painter.call(this, 1); // doesn't really track events, though.
  this.kaput = false;

  this.sparks = new TractorBeamSparkList();
  this.sparkTemplate = this.sparks.alloc();

  this.holderPos = new Vec2d();
  this.heldPos = new Vec2d();
  this.xs = [];
  this.ys = [];
  this.polySize = 0;
  this.holdStrength = 0;
  this.scanStartTime = 0;
  this.kickStrength = 0;
  this.state = TractorBeamPainter.State.EMPTY;
  
  this.workVec = new Vec2d();
}
TractorBeamPainter.prototype = new Painter(1);
TractorBeamPainter.prototype.constructor = TractorBeamPainter;

/**
 * @enum {string}
 */
TractorBeamPainter.State = {
  EMPTY: 0,
  HOLDING: 1,
  RELEASING: 2
};

TractorBeamPainter.prototype.addRayScan = function(rayScan) {
  var x = rayScan.x0 + (rayScan.x1 - rayScan.x0) * (rayScan.time || 1);
  var y = rayScan.y0 + (rayScan.y1 - rayScan.y0) * (rayScan.time || 1);
  this.xs[this.polySize] = x;
  this.ys[this.polySize] = y;
  this.polySize++;
};

TractorBeamPainter.prototype.clearRayScans = function() {
  this.polySize = 0;
};

TractorBeamPainter.prototype.setHolderPos = function(pos) {
  this.holderPos.set(pos);
};

TractorBeamPainter.prototype.setHeldPos = function(pos) {
  this.heldPos.set(pos);
};

TractorBeamPainter.prototype.setHolding = function(str) {
  this.holdStrength = str;
  this.state = TractorBeamPainter.State.HOLDING;
};

TractorBeamPainter.prototype.setReleasing = function(kick) {
  this.kickStrength = kick || 0;
  this.state = TractorBeamPainter.State.RELEASING;
};

TractorBeamPainter.prototype.advance = function(now) {
  this.now = now;
  this.sparks.advance(now);
  if (this.state == TractorBeamPainter.State.RELEASING) {
    this.state = TractorBeamPainter.State.EMPTY;
    var temp = this.sparkTemplate;
    for (var i = 0; i <= 1; i += 0.1) {
      temp.pos.set(this.heldPos).subtract(this.holderPos).scale(i).add(this.holderPos);
      temp.vel.setXY(Math.random() - 0.5, Math.random() - 0.5);
      temp.vel.scaleToLength(2 + this.kickStrength / 8);
      temp.rad = 7 + this.kickStrength / 15;
      temp.endTime = this.now + (3 + this.kickStrength/3) * (1 - Math.abs(0.5 - i));
      this.sparks.add(temp);
    }
  } else if (this.state == TractorBeamPainter.State.HOLDING) {
    var temp = this.sparkTemplate;
    for (var i = 0; i < 1; i++) {
      temp.pos.set(this.heldPos).subtract(this.holderPos).scale(Math.random()).add(this.holderPos);
      temp.vel.setXY(Math.random() - 0.5, Math.random() - 0.5);
      temp.endTime = this.now + 1;
      this.sparks.add(temp);
    }
  }
};

TractorBeamPainter.prototype.paint = function(renderer, layer) {
  if (layer != Vorp.LAYER_SPARKS) return;
  var c = renderer.context;
  if (this.polySize && FLAGS && FLAGS.get('tractorRangePoly')) {
    renderer.setFillStyle('rgba(50, 255, 50, ' + (Math.random() * 0.05 + 0.3) + ')');
    c.beginPath()
    c.lineTo(this.holderPos.x, this.holderPos.y);
    for (var i = 0; i < this.polySize; i++) {
      c.lineTo(this.xs[i], this.ys[i]);
    }
    c.fill();
  }
  this.sparks.paintAll(renderer, this.now);
//  if (this.state == TractorBeamPainter.State.HOLDING) {
//    var c = renderer.context;
//    renderer.setStrokeStyle('rgba(50, 255, 50, ' + (Math.random() * 0.2 + 0.5) + ')');
//    c.lineWidth = 10 + this.holdStrength;
//    c.beginPath();
//    c.moveTo(this.holderPos.x, this.holderPos.y);
//    c.lineTo(this.heldPos.x, this.heldPos.y);
//    c.stroke();
//  }
};

TractorBeamPainter.prototype.isKaput = function() {
  return this.kaput;
};
