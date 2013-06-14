// Copyright 2012 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview Map class, with arbitrary keys that won't collide with any system stuff.
 */

/**
 * @constructor
 */
plex.Map = function() {
  this.m = {};
  this.length = 0;
};

plex.Map.PREFIX = '=';

plex.Map.prototype.set = function(k, v) {
  var objKey = plex.Map.PREFIX + k;
  if (!this.m[objKey]) this.length++;
  this.m[objKey] = v;
  return this;
};

plex.Map.prototype.get = function(k) {
  return this.m[plex.Map.PREFIX + k];
};

plex.Map.prototype.contains = function(k) {
  return this.get(k) !== undefined;
};

plex.Map.prototype.remove = function(k) {
  var objKey = plex.Map.PREFIX + k;
  if (this.m[objKey]) this.length--;
  delete this.m[objKey];
};

/**
 * @return {Array}
 */
plex.Map.prototype.getKeys = function() {
  var keys = [];
  for (var pk in this.m) {
    keys.push(pk.substr(1));
  }
  return keys;
};
