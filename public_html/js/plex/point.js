// Copyright 2006 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * A point, or really an xy pair.
 * @param {number=} opt_x
 * @param {number=} opt_y
 * @constructor
 */
plex.Point = function(opt_x, opt_y) {
  this.x = Number(opt_x || 0);
  this.y = Number(opt_y || 0);
};


plex.Point.prototype.equals = function(that) {
  return this.x == that.x && this.y == that.y;
};


plex.Point.prototype.toString = function() {
  return '{x:' + this.x + ', y:' + this.y + '}';
};


plex.Point.prototype.boundingRect = function() {
  return new plex.Rect(this, this);
};


plex.Point.prototype.setX = function(x) {
  this.x = Number(x);
};


plex.Point.prototype.setY = function(y) {
  this.y = Number(y);
};


plex.Point.prototype.setXy = function(x, y) {
  this.x = Number(x);
  this.y = Number(y);
  return this;
};

plex.Point.prototype.set = function(that) {
  this.x = Number(that.x);
  this.y = Number(that.y);
  return this;
};

plex.Point.prototype.getX = function() {
  return this.x;
};


plex.Point.prototype.getY = function() {
  return this.y;
};

plex.Point.prototype.add = function(that) {
  this.x += Number(that.x);
  this.y += Number(that.y);
  return this;
};

plex.Point.prototype.subtract = function(that) {
  this.x -= that.x;
  this.y -= that.y;
  return this;
};

plex.Point.prototype.scale = function(s) {
  this.x *= s;
  this.y *= s;
  return this;
};

