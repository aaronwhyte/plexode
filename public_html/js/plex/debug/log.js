// Copyright 2010 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview Log class.
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.debug = {};

/**
 * Logger limited by length and by time.
 * Contantly allocates and deletes.
 * @constructor
 */
plex.debug.Log = function(maxLines, maxTimespan) {
  this.maxLines = maxLines;
  this.maxTimespan = maxTimespan;
  this.lines = {};
  this.lowId = 1;
  this.highTime = 0;
  this.nextId = 1;
};

plex.debug.Log.prototype.addLine = function(line) {
  this.lines[this.nextId++] = line;
  if (line.time > this.highTime) {
    this.highTime = line.time;
  }
  this.prune();
};

plex.debug.Log.prototype.prune = function() {
  if (this.maxLines) {
    // prune by length
    var len = this.nextId - this.lowId;
    if (!len) return;
    while (len > this.maxLines) {
      delete this.lines[this.lowId++];
      len--;
    }
  }
  if (this.maxTimespan) {
    // prune by time
    var minTime = this.highTime - this.maxTimespan;
    while (this.lines[this.lowId].time < minTime) {
      delete this.lines[this.lowId++];
    }
  }
};

