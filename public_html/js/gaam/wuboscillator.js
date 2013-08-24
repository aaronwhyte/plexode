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
 * @constructor
 */
function WubOscillator(droneFreq0, droneFreq1, wubFreq0, wubFreq1, gain0, gain1) {
  this.droneFreq0 = droneFreq0;
  this.droneFreq1 = droneFreq1;
  this.wubFreq0 = wubFreq0;
  this.wubFreq1 = wubFreq1;
  this.gain0 = gain0;
  this.gain1 = gain1;
}

WubOscillator.prototype.createNodes = function(ctx) {
  this.wubOsc = ctx.createOscillator();
  this.wubOsc.type = 'sine';

  this.wubGain = ctx.createGainNode();

  this.droneOsc = ctx.createOscillator();
  this.droneOsc.type = 'square';

  this.masterGain = ctx.createGainNode();
  // TODO gain setter?
  //this.masterGain.gain.value = 1;

  this.droneOsc.connect(this.wubGain);
  this.wubOsc.connect(this.wubGain.gain);
  this.wubGain.connect(this.masterGain);
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
