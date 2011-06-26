/**
 * @constructor
 */
function Mark(type, style, x0, y0, x1, y1) {
  this.reset(type, style, x0, y0, x1, y1);
}

/**
 * @enum {number}
 */
Mark.Type = {
    DRAWRECT: 1,
    FILLRECT: 2,
    LINE: 3
};

Mark.prototype.reset = function(type, style, x0, y0, x1, y1) {
  this.type = type;
  this.style = style;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
};

Mark.prototype.toString = function() {
  return [
    this.type,
    this.style,
    this.x0,
    this.y0,
    this.x1,
    this.y1].join();
};

Mark.pool = [];
Mark.poolSize = 0;

Mark.alloc = function(type, style, x0, y0, x1, y1) {
  var retval;
  if (Mark.poolSize) {
    retval = Mark.pool[--Mark.poolSize];
    retval.reset(type, style, x0, y0, x1, y1);
  } else {
    retval = new Mark(type, style, x0, y0, x1, y1);
  }
  return retval;
};

Mark.free = function(mark) {
  Mark.pool[Mark.poolSize++] = mark;
};
