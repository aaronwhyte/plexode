/**
 * @constructor
 */
function Singer() {
  this.now = 0;
  this.lastAdvanceTime = -1;
  this.pos = Vec2d.alloc();
}

Singer.prototype.setPosition = function(x, y) {
  this.pos.setXY(x, y);
};

/**
 * Override to add more computation.
 * @param {number} now
 */
Singer.prototype.advance = function(now) {
  this.now = now;
  if (this.now == this.lastAdvanceTime) return;
  // do stuff
  this.lastAdvanceTime = this.now;
};

/**
 * @param {Object} renderingVisitor  The API the Singer uses to sing with. (Vorp uses a VorpOut.)
 */
Singer.prototype.sing = function(renderingVisitor) {
  throw new Error("you gotta implement Singer.sing() in your subclasses");
};

/**
 * @return {boolean} true iff the Singer is never going to alter its song again,
 * and can be reused or garbage collected by the Gaam.
 */
Singer.prototype.isKaput = function() {
  throw new Error("isKaput is unimplemented");
};
