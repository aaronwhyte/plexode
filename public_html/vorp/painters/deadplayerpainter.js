/**
 * Basic painter for colored rectangles.
 * @param {string} color
 * @constructor
 * @extends {Painter}
 */
function DeadPlayerPainter(color) {
  Painter.call(this, 1);
  this.color = color;
  this.kaput = false;
  this.sparks = this.createSparkList();
  
  this.sparked = false;
  this.sparkTemplate = DeadPlayerPainter.SPARK_ALLOC();
}

DeadPlayerPainter.prototype = new Painter();
DeadPlayerPainter.prototype.constructor = DeadPlayerPainter;

DeadPlayerPainter.sparkPos = new Vec2d();

///////////////////////////////////////
// sparklist implementation functions
///////////////////////////////////////

DeadPlayerPainter.SPARK_ALLOC = function() {
  return {
    startTime: 0,
    endTime: 0,
    pos: new Vec2d(),
    vel: new Vec2d()
  };
};

DeadPlayerPainter.SPARK_COPY = function(src, dest) {
  dest.startTime = src.startTime;
  dest.endTime = src.endTime;
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
};

DeadPlayerPainter.SPARK_ISKAPUT = function(spark, now) {
  return spark.endTime <= now;
};

DeadPlayerPainter.SPARK_ADVANCESPARK = function(spark, now) {
  spark.vel.scale(0.95);
  spark.pos.add(spark.vel);
};

DeadPlayerPainter.SPARK_PAINT = function(renderer, spark, now) {
  var timeFrac = (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 0.25 + 0.75 * timeFrac;
  renderer.setFillStyle('rgba(255, 255, 255, ' + alpha + ')');
  //renderer.setFillStyle('rgba(255, 68, 221, ' + alpha + ')');
  var size = Math.max(0.2, timeFrac * timeFrac) * Prefab.BOX_RADIUS;
  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
};


////////////
// methods
////////////

DeadPlayerPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
  this.sparks.advance(now);
};

DeadPlayerPainter.prototype.createSparkList = function() {
  var s = new SparkList();
  s.alloc = DeadPlayerPainter.SPARK_ALLOC;
  s.copy = DeadPlayerPainter.SPARK_COPY;
  s.isKaput = DeadPlayerPainter.SPARK_ISKAPUT;
  s.advanceSpark = DeadPlayerPainter.SPARK_ADVANCESPARK;
  s.paint = DeadPlayerPainter.SPARK_PAINT;
  return s;
};

/**
 * @param {string} color
 */
DeadPlayerPainter.prototype.setColor = function(color) {
  this.color = color;
};

DeadPlayerPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_SUPERSPARKS) {
    // rectangle
    renderer.setFillStyle(this.color);
    e = this.events.getFromHead(0);
    e.moveToTime(this.now);
//    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);

    // sparks
    if (!this.sparked) {
      this.createSparks(e.px, e.py, e.rx, e.ry, this.now);
      this.sparked = true;
    }
    this.sparks.paintAll(renderer, this.now);    
  }
};

DeadPlayerPainter.prototype.createSparks = function(px, py, rx, ry, now) {
  // Iterate over a grid within the player's footprint.
  for (var a = 0; a < 2 * Math.PI; a += Math.random() * 2 * Math.PI / 10) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 10 + 10 * Math.random();
    this.sparkTemplate.pos.setXY(px, py);
    var speed = 10 + 4 * Math.random();
    this.sparkTemplate.vel.setXY(speed * Math.sin(a), speed * Math.cos(a));
    this.sparks.add(this.sparkTemplate);
  }
  for (var a = 0; a < 2 * Math.PI; a += 2 * Math.PI / 30 + 2 * Math.PI / 30 * Math.random()) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 30 + 25 * Math.random();
    this.sparkTemplate.pos.setXY(px, py);
    var speed = 3;
    this.sparkTemplate.vel.setXY(speed * Math.sin(a), speed * Math.cos(a));
    this.sparks.add(this.sparkTemplate);
  }
};

DeadPlayerPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
