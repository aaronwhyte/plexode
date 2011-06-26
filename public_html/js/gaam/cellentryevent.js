/**
 * @constructor
 */
function CellEntryEvent(xTime, yTime, sledgeId) {
  this.reset(xTime, yTime, sledgeId);
};

CellEntryEvent.prototype.reset = function(xTime, yTime, sledgeId) {
  // Set xTime if hitting from the left or right,
  // or set yTime if hitting from the top or bottom.
  // Only set one.
  
  this.xTime = xTime;
  this.yTime = yTime;
  this.sledgeId = sledgeId;
  
  // One of these is likely to be null.
  this.time = xTime || yTime;
  
  return this;
};

CellEntryEvent.prototype.toString = function() {
  return '{' + [this.xTime, this.yTime, this.sledgeId].join(', ') + '}';
};

CellEntryEvent.pool = [];
CellEntryEvent.poolSize = 0;

CellEntryEvent.alloc = function(xTime, yTime, sledgeId) {
  var retval;
  if (CellEntryEvent.poolSize) {
    retval = CellEntryEvent.pool[--CellEntryEvent.poolSize];
    retval.reset(xTime, yTime, sledgeId);
  } else {
    retval = new CellEntryEvent(xTime, yTime, sledgeId);
  }
  return retval;
};

CellEntryEvent.free = function(obj) {
  CellEntryEvent.pool[CellEntryEvent.poolSize++] = obj;
};
