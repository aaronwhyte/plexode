/**
 * @param {number=} opt_maxTrailLength
 * @constructor
 */
function Painter(opt_maxTrailLength) {
  this.events = new CircularQueue(opt_maxTrailLength || 1);
  this.now = 0;
  this.lastAdvanceTime = -1;
}

Painter.prototype.setPosition = function(x, y) {
  this.addEvent(PaintEvent.alloc(
      PaintEvent.Type.PATH, this.now, x, y, 0, 0, 0, 0));

};

/**
 * @param {PaintEvent} event
 */
Painter.prototype.addEvent = function(event) {
  var fellOffTail = this.events.enqueue(event);
  if (fellOffTail) {
    PaintEvent.free(fellOffTail);
  }
};

/**
 * Override to add more computation, like maybe spark calculations.
 * @param {number} now
 */
Painter.prototype.advance = function(now) {
  this.now = now;
  if (this.now == this.lastAdvanceTime) return;
  // do stuff
  this.lastAdvanceTime = this.now;
};

/**
 * @param {Object} renderingVisitor  The API the painter uses to paint with.
 * @param {number} layer  When painting happens in multiple layers,
 * for debugging or because the order matters visually, this is important.
 */
Painter.prototype.paint = function(renderingVisitor, layer) {
  throw new Error("you gotta implement Painter.paint() in your subclasses");
};

/**
 * @return {boolean} true iff the painter is never going to paint again,
 * and can be reused or garbage collected by the Gaam.
 */
Painter.prototype.isKaput = function() {
  throw new Error("isKaput is unimplemented");
};
