// Copyright 2012 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview Set of strings.
 */

this.plex = this.plex || {};

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

plex.StringSet.prototype.putArray = function(a) {
  for (var i = 0; i < a.length; i++) {
    this.m[plex.StringSet.PREFIX + a[i]] = true;
  }
  return this;
};

plex.StringSet.prototype.contains = function(v) {
  return !!this.m[plex.StringSet.PREFIX + v];
};

plex.StringSet.prototype.remove = function(v) {
  delete this.m[plex.StringSet.PREFIX + v];
  return this;
};

plex.StringSet.prototype.add = function(that) {
  for (var key in that.m) {
    this.m[key] = true;
  }
  return this;
};

plex.StringSet.prototype.subtract = function(that) {
  for (var key in that.m) {
    delete this.m[key];
  }
  return this;
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
