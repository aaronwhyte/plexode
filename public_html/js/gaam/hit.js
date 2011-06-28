/**
 * @constructor
 */
function Hit(xTime, yTime, overlapping, sledgeId1, sledgeId2) {
  this.reset(xTime, yTime, overlapping, sledgeId1, sledgeId2);
}

Hit.prototype.reset = function(xTime, yTime, overlapping, sledgeId1, sledgeId2) {
  // Set xTime if hitting from the left or right,
  // or set yTime if hitting from the top or bottom.
  // Only set one.
  
  this.xTime = xTime;
  this.yTime = yTime;
  this.overlapping = overlapping;
  this.sledgeId1 = sledgeId1;
  this.sledgeId2 = sledgeId2;
  this.next = null;
  
  // One of these is likely to be null.
  this.time = xTime || yTime;
  
  return this;
};

Hit.prototype.toString = function() {
  return [this.xTime, this.yTime, this.overlapping, this.sledgeId1, this.sledgeId2].join();
};


Hit.pool = [];
Hit.poolSize = 0;

Hit.alloc = function(xTime, yTime, overlapping, sledgeId1, sledgeId2) {
  var retval;
  if (Hit.poolSize) {
    retval = Hit.pool[--Hit.poolSize];
    retval.reset(xTime, yTime, overlapping, sledgeId1, sledgeId2);
  } else {
    retval = new Hit(xTime, yTime, overlapping, sledgeId1, sledgeId2);
  }
  return retval;
};

Hit.free = function(hit) {
  Hit.pool[Hit.poolSize++] = hit;
};
