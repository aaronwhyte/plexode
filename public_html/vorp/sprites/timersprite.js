/**
 * @constructor
 * @extends {Sprite}
 */
function TimerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.startTime = -Infinity;
  this.timeoutLength = null;
}

TimerSprite.prototype = new Sprite(null);
TimerSprite.prototype.constructor = TimerSprite;

TimerSprite.prototype.inputIds = {
  RESTART: 0
};

TimerSprite.prototype.outputIds = {
  RUNNING: 0
};

/**
 * @param {number} timeoutLength  timeout length length in ticks
 */
TimerSprite.prototype.setTimeoutLength = function(timeoutLength) {
  this.timeoutLength = timeoutLength;
};

TimerSprite.prototype.isRunning = function() {
  return this.now() < this.startTime + this.timeoutLength;
};

TimerSprite.prototype.restart = function() {
  this.startTime = this.now();
};

TimerSprite.prototype.act = function() {
  if (this.inputs[this.inputIds.RESTART]) {
    this.restart();
  }
  this.outputs[this.outputIds.RUNNING] = this.isRunning() ? 1 : 0;
};
