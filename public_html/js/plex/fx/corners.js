// Copyright 2007 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};
plex.fx = plex.fx || {};

/**
 * @fileoverview  Some kinda cute animated corners.
 * @author Aaron Whyte
 */

/**
 * Creates the 4 corner divs, but hides them by default.
 * @constructor
 */
plex.fx.Corners = function() {
  this.targetRect = new plex.Rect();
  this.pos0 = new plex.Point();
  this.pos1 = new plex.Point();
  this.vel0 = new plex.Point();
  this.vel1 = new plex.Point();
  // temps
  this.v1 = new plex.Point();
  this.v2 = new plex.Point();
 
  //plex.event.addEventListener(document, 'mouseover', this.mouseoverListener);
  //setTimeout(this.animate, this.animationDelay);
  this.corners = [];
  var edges = [[1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1]];
  var borderNames = ['Top', 'Right', 'Bottom', 'Left'];
  for (var i = 0; i < 4; ++i) {
    var c = this.ce('div', document.body);
    this.corners[i] = c;
    s = c.style;
    s.display = 'none'; // hide initially
    s.position = 'absolute';
    for (var j = 0; j < 4; ++j) {
      // set the corner border widths
      s['border' + borderNames[j] + 'Width'] = (4 * edges[i][j]) + 'px';
    }
    // arrange the corners is a square
    s.top = edges[i][0] ? '0px' : '10px';
    s.left = edges[i][3] ? '0px' : '10px';
    s.borderStyle = 'solid';
    s.borderColor = 'red';
    // Make a div inside, to give the border div something to wrap.
    // Shapes the corners correctly w/o browser detection.
    var ic = plex.dom.ce('div', c);
    var is = ic.style;
    is.width = is.height = '4px';
    is.overflow = 'hidden';
  }
};


/**
 * Sets the target element
 * @param {Object} elem
 */
plex.fx.Corners.prototype.setTarget = function(elem) {
  this.target = elem;
};


/**
 * Manually overrides the position.
 * @param {plex.Point} pos0  pos of top-left corner
 * @param {plex.Point} opt_pos1  pos of bottom-right corner.  If this isn't
 *     specified, then pos0 will be used.
 */
plex.fx.Corners.prototype.setPos = function(pos0, opt_pos1) {
  this.pos0.set(pos0);
  this.pos1.set(opt_pos1 || pos0);
};


/**
 * Manually overides the velocity.
 * @param {plex.Point} vel0  vel of top-left corner
 * @param {plex.Point} opt_vel1  vel of bottom-right corner.  If this isn't
 *     specified, then vel0 will be used.
 */
plex.fx.Corners.prototype.setVel = function(vel0, opt_vel1) {
  this.vel0.set(vel0);
  this.vel1.set(opt_vel1 || vel0);
};


/**
 * Accelerates the corners towards the target element.
 */
plex.fx.Corners.prototype.clock = function() {
  if (this.target) {
    plex.dom.getBounds(this.target, this.targetRect);
    this.approach(this.pos0, this.targetRect.p0, this.vel0);
    this.approach(this.pos1, this.targetRect.p1, this.vel1);
    // move corner elements to new positions
    this.positionCorner(this.corners[0], this.pos0.x, this.pos0.y);
    this.positionCorner(this.corners[1], this.pos1.x, this.pos0.y);
    this.positionCorner(this.corners[2], this.pos1.x, this.pos1.y);
    this.positionCorner(this.corners[3], this.pos0.x, this.pos1.y);
  }
};


/**
 * Shows or hides the four corner divs.
 * @param {Boolean} b  true to display, false to hide
 */
plex.fx.Corners.prototype.show = function(b) {
  for (var i = 0; i < 4; ++i) {
    this.corners[i].style.display = b ? '' : 'none';
  }
};


////////////////////
// private methods
////////////////////

/**
 * Adjusts the velocity and position of a point.
 * @param {Object} pos
 * @param {Object} dest
 * @param {Object} vel
 * @private
 */
plex.fx.Corners.prototype.approach = function(pos, dest, vel) {
  var accel = this.v1;
  accel.set(dest).subtract(pos).scale(0.3);
  vel.add(accel).scale(0.5);
  pos.add(vel);
};


/**
 * Sets the postion of a corner div.
 * @param {Object} corner  the corner div element
 * @param {Number} x
 * @param {Number} y
 * @private
 */
plex.fx.Corners.prototype.positionCorner = function(corner, x, y) {
  corner.style.left = (x - 4) + 'px';
  corner.style.top = (y - 4) + 'px';
};
