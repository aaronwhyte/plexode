// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview
 */
this.plex = this.plex || {};
plex.object = {};

plex.object.expose = function(obj) {
  var text = [];
  for (var x in obj) {
    try {
      text.push(x + ' = ' + obj[x]);
    } catch (e) {
      text.push('*** ' + e + ' ***');
    }
  }
  return text.join('\n');
};

plex.object.set = function(obj, attrs) {
  for (var a in attrs) {
    obj[a] = attrs[a];
  }
  return obj;
};

plex.object.keys = function(obj) {
  var keys = [];
  try {
    for (var key in obj) {
      keys.push(key);
    }
  } catch (e) {
    // some kinda access violation
  }
  return keys;
};

plex.object.values = function(obj) {
  var values = [];
  try {
    for (var key in obj) {
      values.push(obj[key]);
    }
  } catch (e) {
    // some kinda access violation
  }
  return values;
};

plex.object.clear = function(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }
  return obj;
};

