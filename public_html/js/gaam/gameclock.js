/**
 * @constructor
 * @param {number?} opt_time
 */
function GameClock(opt_time) {
  this.time = opt_time || 1;
}

/**
 * @param {number} time
 */
GameClock.prototype.setTime = function(time) {
  this.time = time;
};

/**
 * @param {number} add
 */
GameClock.prototype.addTime = function(add) {
  this.time += add;
};

/**
 * @return {number}
 */
GameClock.prototype.getTime = function() {
  return this.time;
};

