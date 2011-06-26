/**
 * An infinite-speed raycast hit test against sledges.
 * The sledges are effectively stationary for the purpose of a rayScan.
 * This class also caches the actual hit.
 * <p>
 * I expect scanning sprites to each have their own re-usable RayScan objects,
 * which they'll reset and pass, visitor-style, to the Phy for population,
 * as an in-out param
 * 
 * @param {number} x0  starting pos
 * @param {number} y0  starting pos
 * @param {number} x1  final pos
 * @param {number} y1  final pos
 * @param {number} rx  radius
 * @param {number} ry  radius
 * @constructor
 */
function RayScan(x0, y0, x1, y1, rx, ry) {
  this.reset(x0, y0, x1, y1, rx, ry);
}

RayScan.prototype.reset = function(x0, y0, x1, y1, rx, ry) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.rx = rx;
  this.ry = ry;
  
  // cache of hit
  this.xTime = null;
  this.yTime = null;
  this.time = null;
  this.hitSledgeId = null;
  return this;
};

/**
 * Calculates the x or y (or neither) hit "time",
 * a number between 0 and 1 signifying how far along the p0->p1 track the hit is.
 * outPair is an array of 2 elements used to return the hitX and hitY times, if any,
 * without allocating memory.
 * @param {number} now  The current time, for the sake of the sledge that's being tested.
 */
RayScan.prototype.calcSledgeHit = function(sledge, sledgeId, now) {
  sledge.moveToTime(now);
  
  var px = this.x0 - sledge.px;
  var py = this.y0 - sledge.py;

  var vx = this.x1 - this.x0;
  var vy = this.y1 - this.y0;
  
  var rx = this.rx + sledge.rx;
  var ry = this.ry + sledge.ry;
  
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
        this.addHitX(tx, sledgeId);
      }
    }
//    else if (py < ry * 0.999) {
//      // Overlapping to start with.
//      this.addHitX(0, sledgeId);
//    }
  }
  if (vy < 0) {
    // heading up (in screen coordinates)
    if (py > ry) {
      // outside below
      var ty = (ry - py) / vy;
      var xAtTy = px + ty * vx;
      if (Math.abs(xAtTy) <= rx) {
        // hit
        this.addHitY(ty, sledgeId);
      }
    } 
//    else if (px < rx * 0.999) {
//      // Overlapping to start with.
//      this.addHitY(0, sledgeId);
//    }
  }
};

RayScan.prototype.addHitX = function(t, sledgeId) {
  var ot = this.time || 1;
  if (t < ot) {
    this.yTime = null;
    this.xTime = this.time = t;
    this.hitSledgeId = sledgeId;
  }
};

RayScan.prototype.addHitY = function(t, sledgeId) {
  var ot = this.time || 1;
  if (t < ot) {
    this.xTime = null;
    this.yTime = this.time = t;
    this.hitSledgeId = sledgeId;
  }
};


RayScan.pool = [];
RayScan.poolSize = 0;

RayScan.alloc = function(x0, y0, x1, y1, rx, ry) {
  var retval;
  if (RayScan.poolSize) {
    retval = RayScan.pool[--RayScan.poolSize];
    retval.reset(x0, y0, x1, y1, rx, ry);
  } else {
    retval = new RayScan(x0, y0, x1, y1, rx, ry);
  }
  return retval;
};

RayScan.free = function(that) {
  RayScan.pool[RayScan.poolSize++] = that;
};
