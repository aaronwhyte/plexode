/**
 * @constructor
 * @extends {Sprite}
 */
function TimerSprite(phy, painter, px, py, rx, ry) {
  Sprite.call(this, phy, painter, px, py, 0, 0, rx, ry, Infinity, Vorp.WALL_GROUP, Infinity);
  this.resetTime = -Infinity;
  this.timeoutLength = null;
  this.onTimeout = null;
  this.oldExpired = true;
}

TimerSprite.prototype = new Sprite();
TimerSprite.prototype.constructor = TimerSprite;

/**
 * @param (number} timeoutLength  timeout length length in ticks
 */
TimerSprite.prototype.setTimeoutLength = function(timeoutLength) {
  this.timeoutLength = timeoutLength;
};

TimerSprite.prototype.setOnTimeout = function(onTimeout) {
  this.onTimeout = onTimeout;
};

TimerSprite.prototype.isExpired = function() {
  return this.phy.getNow() - this.timeoutLength >= this.resetTime;
};

TimerSprite.prototype.stop = function() {
  this.resetTime = Infinity;
};

TimerSprite.prototype.start = function() {
  this.resetTime = this.now();
};

TimerSprite.prototype.act = function() {
  var expired = this.isExpired();
  var timeout = expired && !this.oldExpired;
  this.oldExpired = expired;
  if (timeout && this.onTimeout) {
    this.onTimeout();
  }
};

///**
// * @private
// */
//TimerSprite.prototype.fractionLeft = function() {
//  if (this.resetTime == Infinity) return 1;
//  var frac = 1 - (this.phy.getNow() - this.resetTime) / this.timeoutLength;
//  return Math.min(1, Math.max(0, frac));
//};

