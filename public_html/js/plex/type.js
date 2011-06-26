// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview Code for figuring out the type of an object.
 */

plex.type = {};

/**
 * Figures out the most specific type of an object.
 * Possible values, from most specific to least specific:
 * null, undefined, number, boolean, string, function, array, object
 * @param a
 * @return {string} a lowercase type string
 */
plex.type.getType = function(a) {
  if (a === null) return 'null';
  var t = typeof a;
  switch (t) {
    case 'boolean':
    case 'function':
    case 'number':
    case 'string':
    case 'undefined':
      return t;
    case 'object':
      try {
        if (a.constructor == Array) return 'array';
      } catch(e) {
        // ignore - some object don't allow property access
      }
      return 'object';
  }
};


/**
 * @param a
 * @return {boolean} true iff 'a' is an object, array, or function
 */
plex.type.isObject = function(a) {
  var t = plex.type.getType(a);
  return t == 'object' || t == 'array' || t == 'function';
};


/**
 * @param a
 * @return {boolean}
 */
plex.type.isArray = function(a) {
  return plex.type.getType(a) == 'array';
};


/**
 * @param a
 * @return {boolean}
 */
plex.type.isBoolean = function(a) {
  return typeof a == 'boolean';
};


/**
 * @param a
 * @return {boolean}
 */
plex.type.isFunction = function(a) {
  return typeof a == 'function';
};


/**
 * @param a
 * @return {boolean}
 */
plex.type.isNumber = function(a) {
  return typeof a == 'number';
};


/**
 * @param a
 * @return {boolean}
 */
plex.type.isString = function(a) {
  return typeof a == 'string';
};


/**
 * @param a
 * @return {boolean}
 */
plex.type.isUndefined = function(a) {
  return typeof a == 'undefined';
};
