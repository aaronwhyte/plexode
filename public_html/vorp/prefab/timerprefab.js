/**
 * @constructor
 */
function TimerPrefab(x, y, timeoutLength, onTimeout) {
  this.x = x;
  this.y = y;
  this.timeoutLength = timeoutLength;
  this.onTimeout = onTimeout;
}

TimerPrefab.prototype.createSprites = function(clock) {
  this.sprite = new TimerSprite(clock, new TimerPainter(),
      this.x, this.y, Prefab.WALL_RADIUS * 0.33, Prefab.WALL_RADIUS * 0.33);
  this.sprite.setTimeoutLength(this.timeoutLength);
  this.sprite.setOnTimeout(this.onTimeout);
  return [this.sprite];
};

TimerPrefab.prototype.stop = function() {
  this.sprite.stop();
};

TimerPrefab.prototype.start = function() {
  this.sprite.start();
};

