/**
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @param {number} t  time at which the sledge was at position (px, py)
 * @param {number} expiration  time beyond which the sledge will be invalid.
 * @constructor
 */
function Sledge(px, py, vx, vy, rx, ry, t, expiration) {
  Sledge.news++;
  this.reset(px, py, vx, vy, rx, ry, t, expiration);
}
Sledge.news = 0;

/**
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @param {number} t  time at which the sledge was at position (px, py)
 * @param {number} expiration  time beyond which the sledge will be invalid.
 */
Sledge.prototype.reset = function(px, py, vx, vy, rx, ry, t, expiration) {
  this.px = px;
  this.py = py;
  this.resetVelocity(vx, vy);
  this.rx = rx;
  this.ry = ry;
  this.t = t;
  this.expiration = expiration;

  // Privately cache the original position & time values.
  this.opx = px;
  this.opy = py;
  this.ot = t;

  return this;
};

Sledge.prototype.resetCellCache = function() {
  // Allow CellCollider to cache cell entry/exit data, and reset it here.
  // time between entries; also time between exits
  this.cellPeriodX = null;
  this.cellPeriodY = null;
  // time of next entry
  this.cellEntryTimeX = null;
  this.cellEntryTimeY = null;
  this.frontCellIndexX = null;
  this.frontCellIndexY = null;
};

Sledge.prototype.moveToTime = function(t) {
  if (t != this.t) {
    this.px = this.opx + this.vx * (t - this.ot);
    this.py = this.opy + this.vy * (t - this.ot);
    this.t = t;
  }
};


Sledge.prototype.resetVelocity = function(vx, vy) {
  this.vx = vx;
  this.vy = vy;

  // derived data
  this.dirX = Math.sgn(vx);
  this.dirY = Math.sgn(vy);

  this.resetCellCache();
};

/**
 * Calculates the x or y (or neither) hit time, after now.
 * hit is an out-param Hit object, passed in to avoid allocating memory.
 */
Sledge.prototype.calcHitTime = function(that, out, now) {
  out.reset();
  this.moveToTime(now);
  that.moveToTime(now);

  var px = that.px - this.px;
  var py = that.py - this.py;

  var vx = that.vx - this.vx;
  var vy = that.vy - this.vy;

  var rx = this.rx + that.rx;
  var ry = this.ry + that.ry;

  // flip so position values are >= 0
  if (px < 0) {
    px = -px;
    vx = -vx;
  }
  if (py < 0) {
    py = -py;
    vy = -vy;
  }

  if (vx < 0) {
    // heading left
    if (px > rx) {
      // outside on the right
      var tx = (rx - px) / vx;
      var yAtTx = py + tx * vy;
      if (Math.abs(yAtTx) <= ry) {
        // hit
        out.xTime = tx + now;
      }
//    } else if (py < ry * 0.999) {
//      // Overlapping but headed closer to each other,
//      // so make a collision in the near future.
//      // (Making the time "now" causes infinite loops.)
//      out.xTime = now - 0.1 / vx;
    }
  }
  if (vy < 0) {
    // heading up (in screen coordinates)
    if (py > ry) {
      // outside below
      var ty = (ry - py) / vy;
      var xAtTy = px + ty * vx;
      if (Math.abs(xAtTy) <= rx) {
        // hit
        out.yTime = ty + now;
      }
//    } else if (px < rx * 0.999) {
//      // Overlapping but headed closer to each other,
//      // so make a collision in the near future.
//      // (Making the time "now" causes infinite loops.)
//      out.yTime = now - 0.1 / vy;
    }
  }

  if (!out.xTime && !out.yTime && rx > px && ry > py) {
    out.overlapping = true;
    if (vx) out.xTime = now + 0.1;//Math.abs(0.1 / vx);
    if (vy) out.yTime = now + 0.1;//Math.abs(0.1 / vy);
  }


  // only set one, even if they're both set by "overlap" logic
  if (out.xTime && out.yTime) {
    if (out.xTime < out.yTime) {
      out.yTime = null;
    } else {
      out.xTime = null;
    }
  }
};

///**
// * Determines whether two sledges overlap at 'time'.
// * Treats radius as inclusive.
// */
//Sledge.prototype.overlaps = function(that, time) {
//  this.moveToTime(time);
//  that.moveToTime(time);
//  return Math.abs(this.px - that.px) <= this.rx + that.rx &&
//      Math.abs(this.py - that.py) <= this.ry + that.ry;
//};

Sledge.pool = [];
Sledge.poolSize = 0;


/**
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @param {number} t  time at which the sledge was at position (px, py)
 * @param {number} expiration  time beyond which the sledge will be invalid.
 * @return {Sledge}
 */
Sledge.alloc = function(px, py, vx, vy, rx, ry, t, expiration) {
  var retval;
  if (Sledge.poolSize) {
    retval = Sledge.pool[--Sledge.poolSize];
    retval.reset(px, py, vx, vy, rx, ry, t, expiration);
  } else {
    retval = new Sledge(px, py, vx, vy, rx, ry, t, expiration);
  }
  return retval;
};

/**
 * @param {Sledge} sledge
 */
Sledge.free = function(sledge) {
  Sledge.pool[Sledge.poolSize++] = sledge;
};
