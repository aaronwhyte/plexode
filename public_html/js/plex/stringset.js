// Copyright 2012 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview Set of strings.
 */

/**
 * @constructor
 */
plex.StringSet = function() {
  this.m = {};
};

plex.StringSet.PREFIX = '=';

plex.StringSet.prototype.put = function(v) {
  this.m[plex.StringSet.PREFIX + v] = true;
  return this;
};

plex.StringSet.prototype.contains = function(v) {
  return !!this.m[plex.StringSet.PREFIX + v];
};

plex.StringSet.prototype.remove = function(v) {
  delete this.m[plex.StringSet.PREFIX + v];
};

plex.StringSet.prototype.addStringSet = function(that) {
  for (var key in that.m) {
    this.m[key] = true;
  }
};

/**
 * @return {Array}
 */
plex.StringSet.prototype.getValues = function() {
  var vals = [];
  for (var key in this.m) {
    vals.push(key.substr(1));
  }
  return vals;
};
