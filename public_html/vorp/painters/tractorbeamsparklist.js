/**
 * @constructor
 * @extends {SparkList}
 */
function TractorBeamSparkList() {
  SparkList.call(this);
  this.heldPos = null;
  FLAGS && FLAGS.init('tractorSparks', true);
}
TractorBeamSparkList.prototype = new SparkList();
TractorBeamSparkList.prototype.constructor = TractorBeamSparkList;

TractorBeamSparkList.FRICTION = 0.05;
TractorBeamSparkList.RAND_ACCEL = 1;
  
TractorBeamSparkList.prototype.alloc = function() {
  return {
    pos: new Vec2d(),
    vel: new Vec2d(),
    rad: 0,
    endTime: 0
  };
};

/**
 * Adds a single spark.
 */
TractorBeamSparkList.prototype.add = function(src) {
  if (FLAGS && !FLAGS.get('tractorSparks')) return;
  SparkList.prototype.add.call(this, src);
};

TractorBeamSparkList.prototype.copy = function(src, dest) {
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
  dest.rad = src.rad;
  dest.endTime = src.endTime;
};

TractorBeamSparkList.prototype.isKaput = function(spark, now) {
  return spark.endTime <= now;
};

TractorBeamSparkList.prototype.advanceSpark = function(spark, now) {
  spark.vel.scale(1 - TractorBeamSparkList.FRICTION);
  var vx = spark.vel.x; 
  var vy = spark.vel.y; 
  spark.vel.x = vx + TractorBeamSparkList.RAND_ACCEL * (Math.random() - 0.5);
  spark.vel.y = vy + TractorBeamSparkList.RAND_ACCEL * (Math.random() - 0.5);

  spark.pos.add(spark.vel);
};

TractorBeamSparkList.prototype.paint = function(vorpOut, spark, now) {
  vorpOut.setFillStyle('rgba(50, 255, 50, ' + (Math.random() * 0.2 + 0.4) + ')');
  vorpOut.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, spark.rad, spark.rad);
};
