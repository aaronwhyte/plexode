/**
 * @constructor
 * @extends {Sprite}
 */
function TimerSprite(clock, painter, px, py, rx, ry) {
  Sprite.call(this, clock, painter, px, py, 0, 0, rx, ry, Infinity, Vorp.WALL_GROUP, Infinity);
  this.resetTime = -Infinity;
  this.timeoutLength = null;
  this.onTimeout = null;
  this.oldExpired = true;
}

TimerSprite.prototype = new Sprite();
TimerSprite.prototype.constructor = TimerSprite;

/**
 * @param {number} timeoutLength  timeout length length in ticks
 */
TimerSprite.prototype.setTimeoutLength = function(timeoutLength) {
  this.timeoutLength = timeoutLength;
};

TimerSprite.prototype.setOnTimeout = function(onTimeout) {
  this.onTimeout = onTimeout;
};

TimerSprite.prototype.isExpired = function() {
  return this.getNow() - this.timeoutLength >= this.resetTime;
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
