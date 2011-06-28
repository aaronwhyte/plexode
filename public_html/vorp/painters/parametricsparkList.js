///**
// * Sparklist where spark postion is a function of time and initial
// * @constructor
// * @extends {SparkList}
// */
//function ParametricSparkList() {
//  SparkList.call(this);
//}
//ParametricSparkList.prototype = new SparkList();
//ParametricSparkList.prototype.constructor = ParametricSparkList;
//
//ParametricSparkList.prototype.alloc = function() {
//  var waypoints = [];
//  for
//  return {
//    // positions is a set of positions
//    waypoints: [],
//    startTime: 0,
//    endTime: 0
//  };
//};
//
///**
// * Adds a single spark.
// */
//ParametricSparkList.prototype.add = function(src) {
//  SparkList.prototype.add.call(this, src);
//};
//
//ParametricSparkList.prototype.copy = function(src, dest) {
//  dest.pos.set(src.pos);
//  dest.vel.set(src.vel);
//  dest.rad = src.rad;
//  dest.endTime = src.endTime;
//};
//
//ParametricSparkList.prototype.isKaput = function(spark, now) {
//  return spark.endTime <= now;
//};
//
//ParametricSparkList.prototype.advanceSpark = function(spark, now) {
//  // Parametric spark paths are a function of time.
//  // There's no iterative computation.
//};
//
//ParametricSparkList.prototype.paint = function(renderer, spark, now) {
//  renderer.setFillStyle('rgba(50, 255, 50, ' + (Math.random() * 0.2 + 0.4) + ')');
//  renderer.fillRectPosXYRadXY(spark.pos.x, spark.pos.y, spark.rad, spark.rad);
//};
