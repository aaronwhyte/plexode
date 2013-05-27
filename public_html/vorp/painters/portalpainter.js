/**
 * @constructor
 * @extends {Painter}
 */
function PortalPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.sparks = this.createSparkList();
  
  this.sparked = false;
  this.sparkTemplate = PortalPainter.SPARK_ALLOC();

  this.twinPos = new Vec2d();
  this.towardsTwinPos = new Vec2d();
  this.cornerOffset = new Vec2d();
}

PortalPainter.prototype = new Painter();
PortalPainter.prototype.constructor = PortalPainter;

PortalPainter.sparkPos = new Vec2d();

///////////////////////////////////////
// sparklist implementation functions
///////////////////////////////////////

PortalPainter.SPARK_ALLOC = function() {
  return {
    startTime: 0,
    endTime: 0,
    pos: new Vec2d(),
    vel: new Vec2d()
  };
};

PortalPainter.SPARK_COPY = function(src, dest) {
  dest.startTime = src.startTime;
  dest.endTime = src.endTime;
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
};

PortalPainter.SPARK_ISKAPUT = function(spark, now) {
  return spark.endTime <= now;
};

PortalPainter.SPARK_ADVANCESPARK = function(spark, now) {
  spark.vel.scale(0.95);
  spark.pos.add(spark.vel);
};

PortalPainter.SPARK_PAINT = function(renderer, spark, now) {
  var timeFrac = 1 - (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 0.5;
  var size = (1 - timeFrac/2) * PlasmaSprite.RADIUS * 2;
  renderer.setFillStyle('rgba(255, 0, 255, ' + alpha + ')');
  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
};


////////////
// methods
////////////

PortalPainter.prototype.setTwinPos = function(twinPos) {
  this.twinPos.set(twinPos);
};

PortalPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
  this.sparks.advance(now);
};

PortalPainter.prototype.createSparkList = function() {
  var s = new SparkList();
  s.alloc = PortalPainter.SPARK_ALLOC;
  s.copy = PortalPainter.SPARK_COPY;
  s.isKaput = PortalPainter.SPARK_ISKAPUT;
  s.advanceSpark = PortalPainter.SPARK_ADVANCESPARK;
  s.paint = PortalPainter.SPARK_PAINT;
  return s;
};


PortalPainter.prototype.paint = function(renderer, layer) {
  var e = this.events.getFromHead(0);
  e.moveToTime(this.now);
  if (layer == Vorp.LAYER_MASSES) {
    renderer.setFillStyle('#0df');
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);

  } else if (layer == Vorp.LAYER_SPARKS) {
    renderer.context.lineWidth = 6;
    var c = this.cornerOffset.setXY(e.rx, e.ry);
    t = this.towardsTwinPos.set(this.twinPos).addXY(-e.px, -e.py).scaleToLength(e.rx * 1.5).addXY(e.px, e.py);
    renderer.setStrokeStyle('rgba(0, 223, 255, 0.2)');
    renderer.strokeRectPosXYRadXY(t.x, t.y, e.rx, e.ry);
    renderer.setStrokeStyle('rgba(0, 223, 255, 0.3)');
    for (var i = 0; i < 4; i++) {
      renderer.drawLineXYXY(
          e.px + c.x, e.py + c.y,
          t.x + c.x, t.y + c.y);
      c.rot90Right();
    }
//    var e = this.events.getFromHead(0);
//    e.moveToTime(this.now);
//
//    // sparks
//    if (!this.sparked) {
//      this.createSparks(e.px, e.py, this.now);
//      this.sparked = true;
//    }
//    this.sparks.paintAll(renderer, this.now);
  }
};

PortalPainter.prototype.createSparks = function(px, py, now) {
  // fast-moving short-lived sparks
  var n = 3 + Math.floor(Math.random() * 3);
  var a = Math.random() * 2 * Math.PI;
  for (var i = 0; i < n; i++) {
    a += Math.PI * 2 / n;
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 7 + 5 * Math.random();
    this.sparkTemplate.pos.setXY(px, py);
    var speed = 2 + 1 * Math.random();
    this.sparkTemplate.vel.setXY(speed, 0).rot(a);
    this.sparks.add(this.sparkTemplate);
  }
};

PortalPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
