/**
 * Death-by-plasma explosion painter.
 * @constructor
 * @extends {Painter}
 */
function ExplosionPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.sparks = this.createSparkList();
  
  this.sparked = false;
  this.sparkTemplate = ExplosionPainter.SPARK_ALLOC();
}

ExplosionPainter.prototype = new Painter();
ExplosionPainter.prototype.constructor = ExplosionPainter;

ExplosionPainter.sparkPos = new Vec2d();

///////////////////////////////////////
// sparklist implementation functions
///////////////////////////////////////

ExplosionPainter.SPARK_ALLOC = function() {
  return {
    startTime: 0,
    endTime: 0,
    pos: new Vec2d(),
    vel: new Vec2d()
  };
};

ExplosionPainter.SPARK_COPY = function(src, dest) {
  dest.startTime = src.startTime;
  dest.endTime = src.endTime;
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
};

ExplosionPainter.SPARK_ISKAPUT = function(spark, now) {
  return spark.endTime <= now;
};

ExplosionPainter.SPARK_ADVANCESPARK = function(spark, now) {
  spark.vel.scale(0.95);
  spark.pos.add(spark.vel);
};

ExplosionPainter.SPARK_PAINT = function(renderer, spark, now) {
  var timeFrac = (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 0.25 + 0.75 * timeFrac;
  var size = Math.max(0.2, timeFrac) * Transformer.BOX_RADIUS;
  renderer.setFillStyle('rgba(255, 255, 255, ' + alpha + ')');
  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
};


////////////
// methods
////////////

ExplosionPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
  this.sparks.advance(now);
};

ExplosionPainter.prototype.createSparkList = function() {
  var s = new SparkList();
  s.alloc = ExplosionPainter.SPARK_ALLOC;
  s.copy = ExplosionPainter.SPARK_COPY;
  s.isKaput = ExplosionPainter.SPARK_ISKAPUT;
  s.advanceSpark = ExplosionPainter.SPARK_ADVANCESPARK;
  s.paint = ExplosionPainter.SPARK_PAINT;
  return s;
};


ExplosionPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_SUPERSPARKS) {
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

ExplosionPainter.prototype.createSparks = function(px, py, now) {
  // fast-moving short-lived sparks
  for (var a = 0; a < 2 * Math.PI; a += Math.random() * 2 * Math.PI / 10) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 10 + 10 * Math.random();
    this.sparkTemplate.pos.setXY(px, py);
    var speed = 10 + 4 * Math.random();
    this.sparkTemplate.vel.setXY(speed * Math.sin(a), speed * Math.cos(a));
    this.sparks.add(this.sparkTemplate);
  }
  // slow-moving longer-lived smoke-sparks
  for (var a = 0; a < 2 * Math.PI; a += 2 * Math.PI / 30 + 2 * Math.PI / 30 * Math.random()) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 30 + 45 * Math.random();
    this.sparkTemplate.pos.setXY(px, py);
    var speed = 3;
    this.sparkTemplate.vel.setXY(speed * Math.sin(a), speed * Math.cos(a));
    this.sparks.add(this.sparkTemplate);
  }
};

ExplosionPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
