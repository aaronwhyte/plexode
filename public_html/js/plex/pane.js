// Copyright 2006 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview  Box models suck, so this is a heavy-handed layout engine to
 * give programmers control of where app-like panes appear in the browser
 * window.  Using createWindowPane() you can make non-scrolling app-like
 * layouts.
 * <p>
 * There are a lot of ways to make panes.
 * <ul>
 * <li>createWindowPane - 
 * <li>absPane - A pane whose size is fixed, and whose position is defined
 *     as an x/y offset from one of the four corners of the windowPane, so
 *     it may move as the window is resized.
 * <li>
 * </ul>
 */
plex.pane = {};

/**
 * Creates a new pane covering the whole window, and adds a window resize
 * event listener to it.
 * @param {Window} opt_win  optional window.  Default is the caller's window.
 * @return {plex.Pane} a new window pane
 */
plex.pane.createWindowPane = function(opt_win) {
  var win = opt_win || window;
  // the rect calc function always returns the window rect
  var pane = new plex.Pane(
      function() {
        return plex.window.getRect(win);
      }); 
  var onResize = function() {pane.reposition();};
  plex.event.addListener(win, "resize", onResize);
  pane.reposition();
  return pane;
};

/**
 * Creates a function that takes a rectangle and returns a smaller rect that
 * would cover the x,y cell if the rect were a grid of cols,rows.
 * @param {Object} cols
 * @param {Object} rows
 * @param {Object} x
 * @param {Object} y
 */
plex.pane.getGridCellFunc = function(cols, rows, x, y) {
  return function(rect) {
    return rect.createGridCell(cols, rows, x, y);
  };
};


/**
 * An absolutely positioned pane, responsive to changes in its parent's
 * position.  Tracks its parent and its children.  Creates a div, too.
 * @param {Function} calcRect  a function taking the parent rect as an arg,
 *     and returning this pane's new rect.
 * @param {plex.Pane} opt_parent  optional parent pane to which this pane will
 *     be added as a child.  Default is null.
 * @constructor
 */
plex.Pane = function(calcRect, opt_parent) {
  this.calcRect = calcRect;
  this.element = null;
  this.children = [];
  this.rect = new plex.Rect();
  this.onAfterReposition = null;
  this.parent = opt_parent || null;
  if (this.parent) {
    this.parent.addChild(this);
    this.reposition();
  }
};


/**
 * Adds a child pane.
 * @param {plex.Pane} childPane  pane to add
 */
plex.Pane.prototype.addChild = function(childPane) {
  this.children.push(childPane);
};


/**
 * Sets the element that the pane controls, and styles the element to fit in
 * the pane.
 * @param {HTMLElement} the element.  May be null.
 * @return {HTMLElement} the element that was passed in
 */
plex.Pane.prototype.setElement = function(element) {
  this.element = element;
  this.styleElement();
  return element;
};


/**
 * Gets the element that the pane controls.
 * @return {HTMLElement} the element
 */
plex.Pane.prototype.getElement = function() {
  return this.element;
};


/**
 * If the pane controls an element, sets the element's position and size to fit
 * the pane.
 */
plex.Pane.prototype.styleElement = function() {
  if (this.element) {
    var s = this.element.style;
    var r = this.rect;
    s.position = 'absolute';
    s.top = r.getTop() + 'px';
    s.left = r.getLeft() + 'px';
    s.width = Math.max(r.getWidth(), 0) + 'px';
    s.height = Math.max(r.getHeight(), 0) + 'px';
  }
};


/**
 * Returns the rectangle that this pane's div covers
 * @return {plex.Rect} the rect
 */
plex.Pane.prototype.getRect = function() {
  return this.rect;
};

/**
 * Repositions this pane w.r.t. its parent, and recursively repositions any
 * children.
 * @param {plex.Rect} parentRect  the parent pane if any, used to calculate the
 * position of this child.
 */
plex.Pane.prototype.reposition = function() {
  if (this.parent) {
    var parentRect = this.parent.getRect();
  }
  var newRect = this.calcRect(parentRect);
  if (!newRect.equals(this.rect)) {
    this.rect = newRect;
    this.styleElement();
  }
  for (var i = 0; i < this.children.length; ++i) {
    this.children[i].reposition(newRect);
  }
  if (this.onAfterReposition) {
    this.onAfterReposition();
  }
};


/**
 * Sets a function that is called in the context of this pane, after this pane
 * and its children have been repositioned.
 * @param {Function} func  a function that takes this pane as an argument.
 *     May be null.
 */
plex.Pane.prototype.setOnAfterReposition = function(func) {
  this.onAfterReposition = func;
};


/**
 * Creates and adds a child pane to this parent pane, inset from the parent's
 * edges.  Insets are specified just like CSS padding, except that only pixel
 * and percent values are supported now.
 * @param {Number} top  Inset from the top
 * @param {Number} opt_right  Optional inset from the right.  Defaults to top.
 * @param {Number} opt_bottom  Optional inset from bottom.  Defaults to top.
 * @param {Number} opt_left  Optional inset from left.  Defaults to right.
 * @return {plex.Pane} the new child pane
 */
plex.Pane.prototype.createInsetPane = function(top, opt_right, opt_bottom,
                                               opt_left) {
  var calc = function(rect) {
    return rect.createInsetRect(top, opt_right, opt_bottom, opt_left);
  };
  return new plex.Pane(calc, this);
};


/**
 * Creates two child panes from this parent pane
 * @param {Number} edge  a plex.rect.TOP/RIGHT/BOTTOM/LEFT value
 * @param {String} val  like '4px' or '20%'
 * @return {Array} an array of the two child plex.Panes.  The 0th is the one
 *     close to the 'edge', and the other is the far one.
 */
plex.Pane.prototype.createHalfPanes = function(edge, val) {
  var calc0 = function(rect) {
    return rect.createHalf(edge, val, true);
  };
  var calc1 = function(rect) {
    return rect.createHalf(edge, val, false);
  };
  return [new plex.Pane(calc0, this), new plex.Pane(calc1, this)];
};


plex.Pane.prototype.createGridPanes = function(cols, rows) {
  var grid = [];
  for (var y = 0; y < rows; ++y) {
    var row = [];
    for (var x = 0; x < cols; ++x) {
      var calc = plex.pane.getGridCellFunc(cols, rows, x, y);
      var cell = new plex.Pane(calc, this);
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
};

