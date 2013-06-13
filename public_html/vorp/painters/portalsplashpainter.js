/**
 * Splash when something teleports.
 * @constructor
 * @extends {Painter}
 */
function PortalSplashPainter(exiting) {
  Painter.call(this, 1);
  this.exiting = exiting;
  this.kaput = false;
  this.sparks = this.createSparkList();
  
  this.sparked = false;
  this.sparkTemplate = PortalSplashPainter.SPARK_ALLOC();
}

PortalSplashPainter.prototype = new Painter();
PortalSplashPainter.prototype.constructor = PortalSplashPainter;

//PortalSplashPainter.sparkPos = new Vec2d();

///////////////////////////////////////
// sparklist implementation functions
///////////////////////////////////////

PortalSplashPainter.SPARK_ALLOC = function() {
  return {
    startTime: 0,
    endTime: 0,
    pos: new Vec2d(),
    vel: new Vec2d()
  };
};

PortalSplashPainter.SPARK_COPY = function(src, dest) {
  dest.startTime = src.startTime;
  dest.endTime = src.endTime;
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
};

PortalSplashPainter.SPARK_ISKAPUT = function(spark, now) {
  return spark.endTime <= now;
};

PortalSplashPainter.SPARK_ADVANCESPARK = function(spark, now) {
  spark.pos.add(spark.vel);
};

PortalSplashPainter.SPARK_PAINT = function(renderer, spark, now) {
  var timeFrac = 1 - (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 1 - timeFrac * 0.9;
  var size = 6 - timeFrac * 2;
  renderer.setFillStyle('rgba(0, 223, 255, ' + alpha + ')');
  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
};


////////////
// methods
////////////

PortalSplashPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
  this.sparks.advance(now);
};

PortalSplashPainter.prototype.createSparkList = function() {
  var s = new SparkList();
  s.alloc = PortalSplashPainter.SPARK_ALLOC;
  s.copy = PortalSplashPainter.SPARK_COPY;
  s.isKaput = PortalSplashPainter.SPARK_ISKAPUT;
  s.advanceSpark = PortalSplashPainter.SPARK_ADVANCESPARK;
  s.paint = PortalSplashPainter.SPARK_PAINT;
  return s;
};


PortalSplashPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_SPARKS) {
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);

    // sparks
    if (!this.sparked) {
      this.createSparks(e.px, e.py, this.now);
      this.sparked = true;
    }
    this.sparks.paintAll(vorpOut.getRenderer(), this.now);
  }
};

PortalSplashPainter.prototype.createSparks = function(px, py, now) {
  // fast-moving short-lived sparks
  var n = 6 + Math.floor(Math.random() * 3);
  var a = Math.random() * 2 * Math.PI;
  var duration = 20;
  var size = Transformer.BOX_RADIUS * 2;
  for (var i = 0; i < n; i++) {
    a += Math.PI * 2 / n;
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + duration;
    var speed = 1.2 * size / duration;
    if (this.exiting) {
      this.sparkTemplate.pos.setXY(px, py);
    } else {
      this.sparkTemplate.pos.setXY(-size, 0).rot(a).addXY(px, py);
    }
    this.sparkTemplate.vel.setXY(speed, 0).rot(a);
    this.sparks.add(this.sparkTemplate);
  }
};

PortalSplashPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
