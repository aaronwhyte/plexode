/**
 * @constructor
 * @extends {Painter}
 */
function TractorBeamPainter() {
  Painter.call(this, 1); // doesn't really track events, though.
  //FLAGS && FLAGS.init('tractorSparksFromSource', false);
  //FLAGS && FLAGS.init('tractorSparksWhileHolding', false);
  FLAGS && FLAGS.init('tractorSparksWhileSeeking', true);
  this.kaput = false;

  this.sparks = new TractorBeamSparkList();
  this.sparkTemplate = this.sparks.alloc();

  this.holderPos = new Vec2d();
  this.heldPos = new Vec2d();
  this.holdStrength = 0;  
  this.kickStrength = 0;
  this.state = TractorBeamPainter.State.EMPTY;
  
  this.workVec = new Vec2d();
}
TractorBeamPainter.prototype = new Painter(1);
TractorBeamPainter.prototype.constructor = TractorBeamPainter;

/**
 * @enum {number}
 */
TractorBeamPainter.State = {
  EMPTY: 0,
  HOLDING: 1,
  RELEASING: 2
};

TractorBeamPainter.SPARK_RAD = 6;

TractorBeamPainter.prototype.addRayScan = function(rayScan) {
  if (FLAGS && !FLAGS.get('tractorSparksWhileSeeking')) return;
  if (Math.random() < 0.4) return;
  var temp = this.sparkTemplate;
  var coef = Math.random() * 0.85;
  coef = 1 - (coef * coef * coef);
  temp.pos.setXY(
      rayScan.x0 + (rayScan.x1 - rayScan.x0) * (rayScan.time || 1) * coef,
      rayScan.y0 + (rayScan.y1 - rayScan.y0) * (rayScan.time || 1) * coef);
  temp.vel.setXY(0, 0);
  temp.rad = TractorBeamPainter.SPARK_RAD;// + Math.random() * 2;
  temp.endTime = this.now + 8 + 10 * Math.random();
  this.sparks.add(temp);
};

TractorBeamPainter.prototype.clearRayScans = function() {
  // no-op
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
  this.sparks.heldPos = this.heldPos;
};

TractorBeamPainter.prototype.setReleasing = function(kick) {
  this.kickStrength = kick;
  this.state = TractorBeamPainter.State.RELEASING;
  this.sparks.heldPos = null;
};

TractorBeamPainter.prototype.advance = function(now) {
  this.now = now;
  if (this.now == this.lastAdvanceTime) return;
  if (this.state == TractorBeamPainter.State.RELEASING) {
    this.state = TractorBeamPainter.State.EMPTY;
    var temp = this.sparkTemplate;
    //if (!this.kickStrength) return;
    var baseVel = Vec2d.alloc();
    baseVel.set(this.heldPos).subtract(this.holderPos).scaleToLength(1).rot90Right();
    for (var i = 0; i <= 1; i += 0.05 + Math.random() * 0.05) {
      temp.pos.set(this.heldPos).subtract(this.holderPos).scale(i).add(this.holderPos);
      //temp.vel.setXY(Math.random() - 0.5, Math.random() - 0.5);
      temp.vel.set(baseVel);
      temp.vel.scaleToLength((this.kickStrength/10) * (Math.random() > 0.5 ? 1 : -1));
      temp.rad = TractorBeamPainter.SPARK_RAD;
      temp.endTime = this.now + (Math.random() * (5 + this.kickStrength/3 + this.holdStrength/10));// * (1 - Math.abs(0.5 - i));
      this.sparks.add(temp);
    }
    this.lastAdvanceTime = this.now;
  }
  this.sparks.advance(now);
};

TractorBeamPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    vorpOut.setFillStyle('rgba(50, 200, 50, 0.6)');
    this.sparks.paintAll(vorpOut, this.now);
    if (this.state == TractorBeamPainter.State.HOLDING) {
      vorpOut.setStrokeStyle("rgba(50, 200, 50, " + (Math.random() * 0.2 + 0.6) + ")");
      vorpOut.setLineWidth(6 + this.holdStrength * 0.9);
      vorpOut.beginPath();
      vorpOut.moveTo(this.holderPos.x, this.holderPos.y);
      vorpOut.lineTo(this.heldPos.x, this.heldPos.y);
      vorpOut.stroke();
    }
  }
};

TractorBeamPainter.prototype.isEmpty = function() {
  return this.sparks.isEmpty();
};
