/**
 * @constructor
 * @extends {Painter}
 */
function PlayerAssemblerPainter() {
  Painter.call(this, 1);
  this.kaput = false;
  this.sparks = this.createSparkList();

  this.sparkTemplate = PlayerAssemblerPainter.SPARK_ALLOC();

  this.glowStartTime = -Infinity;
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
  spark.vel.scale(0.89);
  spark.vel.rot(spark.rot);
  spark.pos.add(spark.vel);
};

PlayerAssemblerPainter.SPARK_PAINT = function(vorpOut, spark, now) {
  var timeFrac = 1 - (spark.endTime - now) / (spark.endTime - spark.startTime);
  var alpha = 1 - 0.8 * timeFrac;
  var size = (1 - (timeFrac * 0.9)) * Transformer.BOX_RADIUS;
//  var red = Math.floor(128 + 127 * Math.cos(1.3 * timeFrac * 2 * Math.PI));
//  var green = Math.floor(128 - 127 * Math.cos(timeFrac * 2 * Math.PI));
//  var blue = Math.floor(255 * timeFrac) % 256;
//  vorpOut.setFillStyle('rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')');
  var lite = Math.floor(255 - 128 * timeFrac);
  vorpOut.setFillStyle('rgba(' + lite + ',' + lite + ',' + lite + ',' + alpha + ')');
  vorpOut.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, size, size);
};


////////////
// methods
////////////

PlayerAssemblerPainter.prototype.glowFraction = function(now) {
  return Math.min(1, (now - this.glowStartTime) / 35) ;
};

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

PlayerAssemblerPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_MASSES) {
    var lite = Math.floor(255 -  128 * this.glowFraction(this.now));
    vorpOut.setFillStyle('rgb(' + lite + ', ' + lite + ', ' + lite + ')');
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    vorpOut.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);

  } else if (layer == Vorp.LAYER_SUPERSPARKS) {
    this.sparks.paintAll(vorpOut, this.now);
  }
};

PlayerAssemblerPainter.prototype.createSparks = function(x0, y0, x1, y1, now) {
  this.glowStartTime = now;
  for (var i = -1.2; i <= 1.21; i += 0.2) {
    this.sparkTemplate.startTime = now;
    this.sparkTemplate.endTime = now + 35 + Math.random() * 2;
    this.sparkTemplate.pos.setXY(x1, y1);
    var speed = 6;
    var a = Math.PI * i;
    this.sparkTemplate.vel.setXY(x1 - x0, y1 - y0).scaleToLength(speed).rot(Math.PI / 2 * i);
    this.sparkTemplate.rot = 0;
    this.sparks.add(this.sparkTemplate);
  }
};

PlayerAssemblerPainter.prototype.isKaput = function() {
  return this.sparked && this.sparks.isEmpty();
};
