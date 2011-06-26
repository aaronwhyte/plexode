// Copyright 2010 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview Circular log data
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.debug = plex.debug || {};

/**
 * @constructor
 */
plex.debug.LogLine = function(id, time, tags, data) {
  this.id = id;
  this.time = time;
  this.tags = tags;
  this.data = data;
};
