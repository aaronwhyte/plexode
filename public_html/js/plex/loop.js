// Copyright 2012 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * Animation loop.
 * @param func  The funtion to call (in the context of the window) every tick
 * @param targetFps The desired number of ticks per second.
 * @constructor
 */
plex.Loop = function(func, targetFps) {
  this.func = func;
  this.targetFps = targetFps;

  this.targetPeriod = 1000 / this.targetFps;
  this.delay = Math.floor(this.targetPeriod);
  this.running = false;
  this.prevTime = 0;
  var self = this;
  this.timeoutFunc = function() {
    self.clock();
  };
};

plex.Loop.prototype.start = function() {
  if (this.running) return;
  this.running = true;
  this.clock();
};

plex.Loop.prototype.clock = function() {
  if (!this.running) return; // exception?
  this.func.call();
  var now = (new Date()).getTime();
  var actualPeriod = now - this.prevTime;
  this.prevTime = now;
  this.delay += (actualPeriod < this.targetPeriod) ? 1 : -1;
  if (this.delay < 0) this.delay = 0;
  this.timeoutId = setTimeout(this.timeoutFunc, this.delay);
};

plex.Loop.prototype.stop = function() {
  if (!this.running) return;
  clearTimeout(this.timeoutId);
  this.running = false;
};
