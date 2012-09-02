/**
 * @constructor
 * @extends {Painter}
 */
function PlayerAssemblerPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.sparks = this.createSparkList();

  this.sparkTemplate = PlayerAssemblerPainter.SPARK_ALLOC();
}

PlayerAssemblerPainter.prototype = new Painter();
PlayerAssemblerPainter.prototype.constructor = PlayerAssemblerPainter;

///////////////////////////////////////
// sparklist implementation functions
///////////////////////////////////////

PlayerAssemblerPainter.SPARK_ALLOC = function() {
  return {
    startTime: 0,
    endTime: 0,
    pos: new Vec2d(),
    vel: new Vec2d(),
    rot: 0
  };
};

PlayerAssemblerPainter.SPARK_COPY = function(src, dest) {
  dest.startTime = src.startTime;
  dest.endTime = src.endTime;
  dest.pos.set(src.pos);
  dest.vel.set(src.vel);
  dest.rot = src.rot;
};

PlayerAssemblerPainter.SPARK_ISKAPUT = function(spark, now) {
  return spark.endTime <= now;
};

PlayerAssemblerPainter.SPARK_ADVANCESPARK = function(spark, now) {
  spark.vel.scale(0.98);
  spark.vel.rot(spark.rot);
  spark.pos.add(spark.vel);
};

PlayerAssemblerPainter.SPARK_PAINT = function(renderer, spark, now) {
  var timeFrac = (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 0.25 + 0.75 * timeFrac;
  var size = Math.max(0.1, timeFrac) * Transformer.BOX_RADIUS;
  //renderer.setFillStyle('rgba(255, 68, 221, ' + alpha + ')');
  renderer.setFillStyle('rgba(210, 210, 210,' + alpha + ')');
  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
//  renderer.setStrokeStyle('rgba(210, 210, 210,' + alpha + ')');
//  renderer.context.lineWidth = size;
//  renderer.drawLineXYXY(spark.pos.x, spark.pos.y, spark.pos.x + spark.vel.x * 5, spark.pos.y + spark.vel.y * 5);

};


////////////
// methods
////////////

PlayerAssemblerPainter.prototype.advance = function(now) {
  Painter.prototype.advance.call(this, now);
  this.sparks.advance(now);
};

PlayerAssemblerPainter.prototype.createSparkList = function() {
  var s = new SparkList();
  s.alloc = PlayerAssemblerPainter.SPARK_ALLOC;
  s.copy = PlayerAssemblerPainter.SPARK_COPY;
  s.isKaput = PlayerAssemblerPainter.SPARK_ISKAPUT;
  s.advanceSpark = PlayerAssemblerPainter.SPARK_ADVANCESPARK;
  s.paint = PlayerAssemblerPainter.SPARK_PAINT;
  return s;
};

PlayerAssemblerPainter.prototype.paint = function(renderer, layer) {
  if (layer == Vorp.LAYER_MASSES) {
    // rectangle
    renderer.setFillStyle('rgb(128,128,200)');
//    renderer.setFillStyle('rgb(80,48,176)');
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);

  } else if (layer == Vorp.LAYER_SUPERSPARKS) {
    this.sparks.paintAll(renderer, this.now);
  }
};

PlayerAssemblerPainter.prototype.createSparks = function(x0, y0, x1, y1, now) {
  var speed;
  // swirly cloud
  for (var i = -10; i <= 10; i+= 0.5) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 20 + 50 * Math.random();
    this.sparkTemplate.pos.setXY((x0 + x1) / 2, (y0 + y1) / 2);
    speed = 3 + 2 * Math.random();
    this.sparkTemplate.vel.setXY(x1 - x0, y1 - y0).scaleToLength(speed).rot((Math.random() - 0.5) * Math.PI / 4);
    this.sparkTemplate.rot = i / 60;
    this.sparks.add(this.sparkTemplate);
  }
  // little puff in the middle
  for (var i = 0; i < 1; i += 0.1) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 20 + 40 * Math.random();
    this.sparkTemplate.pos.setXY(x1, y1);
    speed = 1 + 2 * Math.random();
    var a = 2 * Math.PI * i + Math.random();
    this.sparkTemplate.vel.setXY(speed * Math.sin(a), speed * Math.cos(a));
    this.sparkTemplate.rot = 0;
    this.sparks.add(this.sparkTemplate);
  }
};

PlayerAssemblerPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
