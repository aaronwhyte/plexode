// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview  Rectangle math
 */

plex.rect = {};

plex.rect.HORIZ = 1;
plex.rect.FAR = 2;

plex.rect.TOP = plex.rect.HORIZ;
plex.rect.RIGHT = plex.rect.FAR;
plex.rect.BOTTOM = plex.rect.FAR | plex.rect.HORIZ;
plex.rect.LEFT = 0;

plex.rect.getOppositeEdge = function(edge) {
  var r = plex.rect;
  switch (edge) {
    case r.TOP: return r.BOTTOM;
    case r.RIGHT: return r.LEFT;
    case r.BOTTOM: return r.TOP;
    case r.LEFT: return r.RIGHT;
  }
  throw Error('Unknown edge: ' + edge);
};

plex.rect.PARSE_VALUE_RE = /s*(-?\d+(.\d+)?)(\%|px)?\s*$/;


/**
 * Allows negative numbers, fractions, and leading and trailing whitespace.
 * Legal units are "%" and "px".  If no units are given, "px" are assumed.
 * @param {string|number} str
 * @return an array [number, units], or null
 */
plex.rect.parseMeasurement = function(str) {
  str = String(str);
  var m = str.match(plex.rect.PARSE_VALUE_RE);
  return m ? [parseFloat(m[1]), m[3] ? m[3] : 'px'] : null;
};


/**
 * Creates a rect using the coordinates specified.
 * 
 * @param {number} x0 left
 * @param {number} y0 top
 * @param {number} x1 right
 * @param {number} y1 bottom
 * @return {plex.Rect} the new rect
 */
plex.rect.createXyxy = function(x0, y0, x1, y1) {
  return new plex.Rect(new plex.Point(x0, y0), new plex.Point(x1, y1));
};


/**
 * Creates a rect using the top-left coords and the width and height.
 * @param {number} x left
 * @param {number} y top
 * @param {number} w width
 * @param {number} h height
 * @return {plex.Rect} the new rect
 */
plex.rect.createXywh = function(x, y, w, h) {
  return plex.rect.createXyxy(x, y, x + w, y + h);
};


/**
 * Creates a bounding rect from a list of boundingRects
 * @param {Array} objs  an array of 1 or more objects that implement
 * boundingRect()
 * @return {plex.Rect} a new rectangle bounding all the inputs.
 */
plex.rect.boundingRect = function(objs) {
  for (var i = 0; i < objs.length; ++i) {
    var r = objs[i].boundingRect();
    if (!i) {
      var left = r.getLeft();
      var top = r.getTop();
      var right = r.getRight();
      var bottom = r.getBottom();
    } else {
      left = Math.min(left, r.getLeft());
      top = Math.min(top, r.getTop());
      right = Math.max(right, r.getRight());
      bottom = Math.max(bottom, r.getBottom());
    }
  }
  return plex.rect.createXyxy(left, top, right, bottom);
};


/**
 * Creates new rectangle with new points p0 and p1 representing the top-left
 * and bottom-right corners.  Optional point param values are copied, not
 * set by reference.
 * @param {plex.Point} opt_p0
 * @param {plex.Point} opt_p1
 * @constructor
 */
plex.Rect = function(opt_p0, opt_p1) {
  this.p0 = new plex.Point();
  this.p1 = new plex.Point();
  if (opt_p0) this.p0.set(opt_p0);
  if (opt_p1) this.p1.set(opt_p1);
};


plex.Rect.prototype.set = function(rect) {
  this.p0.set(rect.p0);
  this.p1.set(rect.p1);
};

plex.Rect.prototype.setP0 = function(p) {
  this.p0.set(p);
};


plex.Rect.prototype.setP1 = function(p) {
  this.p1.set(p);
};


plex.Rect.prototype.setTop = function(top) {
  this.p0.setY(top);
};


plex.Rect.prototype.setRight = function(right) {
  this.p1.setX(right);
};


plex.Rect.prototype.setBottom = function(bottom) {
  this.p1.setY(bottom);
};


plex.Rect.prototype.setLeft = function(left) {
  this.p0.setX(left);
};


plex.Rect.prototype.setXyxy = function(x0, y0, x1, y1) {
  this.p0.setXy(x0, y0);
  this.p1.setXy(x1, y1);
};


/**
 * Compare rects for equality
 * @param {plex.Rect} that
 * @return {boolean}
 */
plex.Rect.prototype.equals = function(that) {
  return this.p0.equals(that.p0) && this.p1.equals(that.p1);
};


plex.Rect.prototype.toString = function() {
  return '{p0:' + this.p0.toString() + ', p1:' + this.p1.toString() + '}';
};


plex.Rect.prototype.boundingRect = function() {
  return this;
};


plex.Rect.prototype.getTop = function() {
  return this.p0.getY();
};


plex.Rect.prototype.getRight = function() {
  return this.p1.getX();
};


plex.Rect.prototype.getBottom = function() {
  return this.p1.getY();
};


plex.Rect.prototype.getLeft = function() {
  return this.p0.getX();
};


plex.Rect.prototype.getWidth = function() {
  return this.p1.getX() - this.p0.getX();
};


plex.Rect.prototype.getHeight = function() {
  return this.p1.getY() - this.p0.getY();
};


plex.Rect.prototype.getEdgePos = function(edge) {
  var r = plex.rect;
  switch (edge) {
    case r.TOP: return this.getTop();
    case r.RIGHT: return this.getRight();
    case r.BOTTOM: return this.getBottom();
    case r.LEFT: return this.getLeft();
    default: throw 'unknown fromEdge "' + edge + '"';
  }
};


/**
 * 
 * @param {number} edge one of the plex.rect.TOP|RIGHT|BOTOM|LEFT constants
 * @param {number|string|Array} dist can be either a measurement [val, units],
 *     or a string or number to parse.
 */
plex.Rect.prototype.getInsetPosition = function(edge, dist) {
  var r = plex.rect;
  var isHoriz = r.HORIZ & edge;
  var isFar = r.FAR & edge;
  var m = plex.type.isArray(dist) ? dist : 
      plex.rect.parseMeasurement(( /** @type {string} */ dist));
  var pos = this.getEdgePos(edge);
  switch(m[1]) {
    case '%':
      pos += 0.01 * m[0] * (isFar ? -1 : 1) *
             (isHoriz ? this.getHeight() : this.getWidth());
      break;
    case 'px':
      pos += (isFar ? -1 : 1) * m[0];
      break;
    default:
      throw 'unknown units "' + m[1] + '"';
  }
  return pos;
};


/**
 * Get the document-pixel position of a point that's a that is x% from the
 * left edge of the rect, and y% from the top. 
 * @param {number} xPercent
 * @param {number} yPercent
 * @param {plex.Point} opt_ptOut  optional point to set.
 * @return {plex.Point} either opt_ptOut or a new Point
 */
plex.Rect.prototype.getPercentPoint = function(xPercent, yPercent, opt_ptOut) {
  var p = opt_ptOut || new plex.Point();
  return p.setXy(this.getInsetPosition(plex.rect.LEFT, [xPercent, '%']),
                 this.getInsetPosition(plex.rect.TOP, [yPercent, '%']));
};


/**
 * Create an inset rectangle.  
 * @param {string} top
 * @param {string=} opt_right
 * @param {string=} opt_bottom
 * @param {string=} opt_left
 * @return {plex.Rect}
 */
plex.Rect.prototype.createInsetRect = function(
    top, opt_right, opt_bottom, opt_left) {
  var r = plex.rect;
  var right = (/** @type {string} */ opt_right || top);
  var bottom = (/** @type {string} */ opt_bottom || top);
  var left = (/** @type {string} */ opt_left || right);
  return plex.rect.createXyxy(
      this.getInsetPosition(r.LEFT, left),
      this.getInsetPosition(r.TOP, top),
      this.getInsetPosition(r.RIGHT, right),
      this.getInsetPosition(r.BOTTOM, bottom));
};


/**
 * Creates a rect by splitting this at a distance 'val' from 'edge',
 * and returning the rect near 'fromEdge', or the other half, depending on
 * 'nearHalf'.
 * @param {number} edge  one of plex.rect.(TOP|RIGHT|BOTTOM|LEFT)
 * @param {string} val  how far from the edge to make the split
 * @param {boolean} nearHalf  return the half near the edge, or the other half
 * @return {plex.Rect} a new Rect
 */
plex.Rect.prototype.createHalf = function(edge, val, nearHalf) {
  var mid = this.getInsetPosition(edge, val);
  var r = plex.rect;
  if (!nearHalf) edge = r.getOppositeEdge(edge);
  var left = edge == r.RIGHT ? mid : this.getLeft(); 
  var right = edge == r.LEFT ? mid : this.getRight();
  var top = edge == r.BOTTOM ? mid : this.getTop();
  var bottom = edge == r.TOP ? mid : this.getBottom();
  return plex.rect.createXyxy(left, top, right, bottom);
};


/**
 * @param {Object} columns
 * @param {Object} rows
 * @param {Object} column
 * @param {Object} row
 */
plex.Rect.prototype.createGridCell = function(columns, rows, column, row) {
  var cellWidth = this.getWidth() / columns;
  var cellLeft = this.getLeft() + cellWidth * column;

  var cellHeight = this.getHeight() / rows;
  var cellTop = this.getTop() + cellHeight * row;

  return plex.rect.createXywh(cellLeft, cellTop, cellWidth, cellHeight);
};


/**
 * @return {Array} rows, each containing an Array of plex.Rect objs.
 */
plex.Rect.prototype.createGrid = function(cols, rows) {
  var height = this.getHeight();
  var width = this.getWidth();
  var top = this.getTop();
  var left = this.getLeft();
  var i;

  var cellTops = [];
  var cellHeight = height / rows;
  for (i = 0; i <= rows; ++i) {
    cellTops[i] = top + cellHeight * i;
  }
  var cellLefts = [];
  var cellWidth = width / cols;
  for (i = 0; i <= cols; ++i) {
    cellLefts[i] = left + cellWidth * i;
  }

  var grid = [];
  for (i = 0; i < rows; ++i) {
    var row = [];
    for (var j = 0; j < cols; ++j) {
      var cell = plex.rect.createXyxy(cellTops[i], cellLefts[j],
                                      cellTops[i + 1], cellLefts[j + 1]);
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
};
