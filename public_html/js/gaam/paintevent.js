/**
 * @param {PaintEvent.Type} type
 * @param {number} time  time at which the PaintEvent was at position (px, py)
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @constructor
 */
function PaintEvent(type, time, px, py, vx, vy, rx, ry) {
  this.reset(type, time, px, py, vx, vy, rx, ry);
}

/**
 * @enum {number}
 */
PaintEvent.Type = {
  /**
   * End of the line.  The sprite is gone, so the painter
   * can die whenit's done with any leftover effects.
   */
  KAPUT: 1,
  
  /**
   * Change in trajectory or size.  Basically records sledge creation. 
   */
  PATH: 2
};

/**
 * @param {PaintEvent.Type} type
 * @param {number} time  time at which the PaintEvent was at position (px, py)
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 */
PaintEvent.prototype.reset = function(type, time, px, py, vx, vy, rx, ry) {
  this.type = type;
  this.time = time;
  this.px = px;
  this.py = py;
  this.vx = vx;
  this.vy = vy;
  this.rx = rx;
  this.ry = ry;

  // Privately cache the original position & time values.
  this.opx = px;
  this.opy = py;
  this.startTime = time;

  return this;
};

PaintEvent.prototype.moveToTime = function(time) {
  if (time != this.time) {
    this.px = this.opx + this.vx * (time - this.startTime);
    this.py = this.opy + this.vy * (time - this.startTime);
    this.time = time;
  }
};

PaintEvent.pool = [];
PaintEvent.poolSize = 0;

/**
 * @param {PaintEvent.Type} type
 * @param {number} time  time at which the PaintEvent was at position (px, py)
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @return {PaintEvent}
 */
PaintEvent.alloc = function(type, time, px, py, vx, vy, rx, ry) {
  var retval;
  if (PaintEvent.poolSize) {
    retval = PaintEvent.pool[--PaintEvent.poolSize];
    retval.reset(type, time, px, py, vx, vy, rx, ry);
  } else {
    retval = new PaintEvent(type, time, px, py, vx, vy, rx, ry);
  }
  return retval;
};

/**
 * @param {PaintEvent} PaintEvent
 */
PaintEvent.free = function(PaintEvent) {
  PaintEvent.pool[PaintEvent.poolSize++] = PaintEvent;
};
