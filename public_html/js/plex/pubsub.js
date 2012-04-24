// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview
 */
this.plex = this.plex || {};

/**
 * Allows a publisher to call multiple subscriber functions at once.
 * Subscribers can add and remove themselves.
 * @constructor
 */
plex.PubSub = function() {
  this.subs = [];
};

/**
 * Adds a subscriber function.  Does not check to see if the function is a dup.
 * @param {Object} func
 */
plex.PubSub.prototype.subscribe = function(func) {
  this.subs.push(func);
};

/**
 * Deletes a subscriber function.  Only deletes the first match found.
 * @param {Object} func
 */
plex.PubSub.prototype.unsubscribe = function(func) {
  var index = plex.array.indexOf(this.subs, func);
  if (index < 0) {
    throw Error('Could not find function to unsubscribe.');
  }
  this.subs.splice(index, 1);
};

/**
 * Calls all the subscribers in the order in which they were added,
 * passing all arguments along.  Calls the functions in the global context.
 */
plex.PubSub.prototype.publish = function(/* whatever */) {
  for (var i = 0, n = this.subs.length; i < n; ++i) {
    this.subs[i].apply(null, arguments);
  }
};

/**
 * Clears the subscriber list.
 */
plex.PubSub.prototype.clear = function () {
  this.subs.length = 0;
};
