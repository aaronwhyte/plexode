/**
 * @constructor
 * @extends {Painter}
 */
function TractorBeamPainter() {
  Painter.call(this, 1); // doesn't really track events, though.
  //FLAGS && FLAGS.init('tractorSparksFromSource', false);
  FLAGS && FLAGS.init('tractorSparksWhileHolding', true);
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

TractorBeamPainter.prototype.addRayScan = function(rayScan) {
  if (!FLAGS || !FLAGS.get('tractorSparksWhileSeeking')) return;
  if (Math.random() < 0.4) return;
  var temp = this.sparkTemplate;
  var coef = Math.random() * 0.85;
  coef = 1 - (coef * coef * coef);
  temp.pos.setXY(
      rayScan.x0 + (rayScan.x1 - rayScan.x0) * (rayScan.time || 1) * coef,
      rayScan.y0 + (rayScan.y1 - rayScan.y0) * (rayScan.time || 1) * coef);
  temp.vel.setXY(0, 0);
  temp.rad = 5;// + Math.random() * 2;
  temp.endTime = this.now + 8 + 2 * Math.random();
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
  if (this.state == TractorBeamPainter.State.RELEASING) {
    this.state = TractorBeamPainter.State.EMPTY;
    var temp = this.sparkTemplate;
    for (var i = 0; i <= 1; i += Math.random() * 0.1) {
      temp.pos.set(this.heldPos).subtract(this.holderPos).scale(i).add(this.holderPos);
      temp.vel.setXY(Math.random() - 0.5, Math.random() - 0.5);
      temp.vel.scaleToLength(2 + this.kickStrength / 5);
      temp.rad = 5;
      temp.endTime = this.now + (5 + this.kickStrength/3 + this.holdStrength/3) * (1 - Math.abs(0.5 - i));
      this.sparks.add(temp);
    }
  }

  if (this.state == TractorBeamPainter.State.HOLDING &&
      FLAGS && FLAGS.get('tractorSparksWhileHolding')) {
    for (var i = 0; i < 4 + this.holdStrength; i++) {
      if (Math.random() > 0.01) continue;
      var temp = this.sparkTemplate;
      var along = Math.random();
      temp.pos.set(this.heldPos).subtract(this.holderPos)
          .scale(along)
          .add(this.holderPos);
      temp.vel.set(this.heldPos).subtract(this.holderPos).rot90Right();
      temp.vel.scaleToLength((Math.random() - 0.5) * (2 + this.holdStrength));
      temp.rad = 5;
      temp.endTime = this.now + Math.random() * 30;
      this.sparks.add(temp);
    }
  }
  this.sparks.advance(now);
};

TractorBeamPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    renderer.setFillStyle('rgba(50, 200, 50, 0.6)');
    this.sparks.paintAll(renderer, this.now);
    if (this.state == TractorBeamPainter.State.HOLDING) {
      var c = renderer.context;
      renderer.setStrokeStyle("rgba(50, 200, 50, " + (Math.random() * 0.2 + 0.6) + ")");
      c.lineWidth = 6 + this.holdStrength * 0.9;
      c.beginPath();
      c.moveTo(this.holderPos.x, this.holderPos.y);
      c.lineTo(this.heldPos.x, this.heldPos.y);
      c.stroke();
    }
  }
};

TractorBeamPainter.prototype.isEmpty = function() {
  return this.sparks.isEmpty();
};
