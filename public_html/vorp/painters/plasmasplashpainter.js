/**
 * Splash when plasma hits non-exploding thing, like wall or block.
 * @constructor
 * @extends {Painter}
 */
function PlasmaSplashPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.sparks = this.createSparkList();
  
  this.sparked = false;
  this.sparkTemplate = PlasmaSplashPainter.SPARK_ALLOC();
}

PlasmaSplashPainter.prototype = new Painter();
PlasmaSplashPainter.prototype.constructor = PlasmaSplashPainter;

PlasmaSplashPainter.sparkPos = new Vec2d();

///////////////////////////////////////
// sparklist implementation functions
///////////////////////////////////////

PlasmaSplashPainter.SPARK_ALLOC = function() {
  return {
    startTime: 0,
    endTime: 0,
    pos: new Vec2d(),
    vel: new Vec2d()
  };
};

PlasmaSplashPainter.SPARK_COPY = function(src, dest) {
  dest.startTime = src.startTime;
  dest.endTime = src.endTime;
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
};

PlasmaSplashPainter.SPARK_ISKAPUT = function(spark, now) {
  return spark.endTime <= now;
};

PlasmaSplashPainter.SPARK_ADVANCESPARK = function(spark, now) {
  spark.vel.scale(0.95);
  spark.pos.add(spark.vel);
};

PlasmaSplashPainter.SPARK_PAINT = function(renderer, spark, now) {
  var timeFrac = 1 - (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 0.5;
  var size = (1 - timeFrac/2) * PlasmaPainter.LINE_WIDTH * 2;
  renderer.setFillStyle('rgba(255, 0, 255, ' + alpha + ')');
  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
};


////////////
// methods
////////////

PlasmaSplashPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
  this.sparks.advance(now);
};

PlasmaSplashPainter.prototype.createSparkList = function() {
  var s = new SparkList();
  s.alloc = PlasmaSplashPainter.SPARK_ALLOC;
  s.copy = PlasmaSplashPainter.SPARK_COPY;
  s.isKaput = PlasmaSplashPainter.SPARK_ISKAPUT;
  s.advanceSpark = PlasmaSplashPainter.SPARK_ADVANCESPARK;
  s.paint = PlasmaSplashPainter.SPARK_PAINT;
  return s;
};


PlasmaSplashPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);

    // sparks
    if (!this.sparked) {
      this.createSparks(e.px, e.py, this.now);
      this.sparked = true;
    }
    this.sparks.paintAll(renderer, this.now);    
  }
};

PlasmaSplashPainter.prototype.createSparks = function(px, py, now) {
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

PlasmaSplashPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
