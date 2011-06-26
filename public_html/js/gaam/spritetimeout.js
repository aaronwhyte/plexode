/**
 * @constructor
 * @param {number} time
 * @param {number} spriteId
 * @param {number} actionId
 */
function SpriteTimeout(time, spriteId, actionId) {
  this.reset(time, spriteId, actionId);
}

SpriteTimeout.prototype.reset = function(time, spriteId, actionId) {
  this.time = time;
  this.spriteId = spriteId;
  this.actionId = actionId;

  this.next = null;
  return this;
};

SpriteTimeout.pool = [];
SpriteTimeout.poolSize = 0;

SpriteTimeout.alloc = function(time, spriteId, actionId) {
  var retval;
  if (SpriteTimeout.poolSize) {
    retval = SpriteTimeout.pool[--SpriteTimeout.poolSize];
    retval.reset(time, spriteId, actionId);
  } else {
    retval = new SpriteTimeout(time, spriteId, actionId);
  }
  return retval;
};

SpriteTimeout.free = function(hit) {
  SpriteTimeout.pool[SpriteTimeout.poolSize++] = hit;
};
