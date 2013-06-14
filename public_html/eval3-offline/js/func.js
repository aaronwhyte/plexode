// Copyright 2006 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview Code to handle function-related stuff.
 */
plex.func = {};

/**
 * Creates a new function that calls 'fn' with 'self' as 'this'.
 * @param {Function} fn
 * @param {Object} self
 * @return {Function}
 */
plex.func.bind = function(fn, self) {
  return function() {
    fn.apply(self, arguments);
  };
};

/**
 * Converts caller's arguments (or any arguments) to an array.
 * Useful because 'arguments' is actually an Object with a 'length' member,
 * and numeric keys, but lacks array methods like 'join'.
 * @param {Object} opt_arguments  optional arguments object.  If omitted, the
 *     caller's arguments are used.
 * @return {Array}
 */
plex.func.argumentArray = function(opt_arguments) {
  var a = [];
  var args = opt_arguments || caller.arguments;
  for (var i = 0, n = args.length; i < n; ++i) {
    a.push(args[i]);
  }
  return a;
};
