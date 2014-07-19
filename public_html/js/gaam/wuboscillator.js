/**
 * Makes wub-wub noises continuously, with a single adjustable value that controls the
 * drone frequency, the "wub" gain modulation frequency, and the final gain.
 * Good for motor noises and stuff.
 * @param droneFreq0
 * @param droneFreq1
 * @param wubFreq0
 * @param wubFreq1
 * @param gain0
 * @param gain1
 * @param {String=} opt_droneType square, sine, etc.
 * @constructor
 */
function WubOscillator(droneFreq0, droneFreq1, wubFreq0, wubFreq1, gain0, gain1, opt_droneType) {
  this.droneFreq0 = droneFreq0;
  this.droneFreq1 = droneFreq1;
  this.wubFreq0 = wubFreq0;
  this.wubFreq1 = wubFreq1;
  this.gain0 = gain0;
  this.gain1 = gain1;
  this.droneType = opt_droneType || 'square';
}

WubOscillator.prototype.createNodes = function(ctx) {
  this.wubOsc = ctx.createOscillator();
  if (!this.wubOsc.start && this.wubOsc.noteOn) this.wubOsc.start = this.wubOsc.noteOn;
  if (!this.wubOsc.stop && this.wubOsc.noteOff) this.wubOsc.start = this.wubOsc.noteOff;
  this.wubOsc.type = 'sine';

  this.wubGain = this.createGain(ctx);

  this.droneOsc = ctx.createOscillator();
  if (!this.droneOsc.start && this.droneOsc.noteOn) this.droneOsc.start = this.droneOsc.noteOn;
  if (!this.droneOsc.stop && this.droneOsc.noteOff) this.droneOsc.start = this.droneOsc.noteOff;
  this.droneOsc.type = this.droneType;

  this.masterGain = this.createGain(ctx);

  this.droneOsc.connect(this.wubGain);
  this.wubOsc.connect(this.wubGain.gain);
  this.wubGain.connect(this.masterGain);
};

WubOscillator.prototype.createGain = function(ctx) {
  if (ctx.createGain) {
    return ctx.createGain();
  }
  if (ctx.createGainNode) {
    return ctx.createGainNode();
  }
  return null;
};



WubOscillator.prototype.connect = function(dest) {
  this.masterGain.connect(dest);
};

WubOscillator.prototype.setValue = function(v) {
  this.droneOsc.frequency.value = (this.droneFreq1 - this.droneFreq0) * v + this.droneFreq0;
  this.wubOsc.frequency.value = (this.wubFreq1 - this.wubFreq0) * v + this.wubFreq0;
  this.masterGain.gain.value = (this.gain1 - this.gain0) * v + this.gain0;
};

WubOscillator.prototype.linearRampToValueAtTime = function(v, t) {
  this.droneOsc.frequency.linearRampToValueAtTime((this.droneFreq1 - this.droneFreq0) * v + this.droneFreq0, t);
  this.wubOsc.frequency.linearRampToValueAtTime((this.wubFreq1 - this.wubFreq0) * v + this.wubFreq0, t);
  this.masterGain.gain.linearRampToValueAtTime((this.gain1 - this.gain0) * v + this.gain0, t);
};

WubOscillator.prototype.start = function(t) {
  this.wubOsc.start(t);
  this.droneOsc.start(t);
};

WubOscillator.prototype.stop = function(t) {
  this.wubOsc.stop(t);
  this.droneOsc.stop(t);
};
