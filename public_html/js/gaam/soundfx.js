/**
 * Utils for producing sound effects positioned in 2D.
 * @param {AudioContext} audioContext
 * @constructor
 */
function SoundFx(audioContext) {
  this.ctx = audioContext;
  if (this.ctx) {
    if (!(this.ctx.createGain || this.ctx.createGainNode) || !this.ctx.createOscillator) {
      this.ctx = null;
    }
  }
  if (this.ctx) {
    this.masterGainNode = this.createGain();
    this.masterGainNode.connect(this.ctx.destination);
  }
}

SoundFx.Z_DISTANCE = 200;

SoundFx.audioContext = null;

SoundFx.createInstance = function() {
  if (!SoundFx.audioContext) {
    if (typeof AudioContext !== 'undefined') {
      SoundFx.audioContext = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
      SoundFx.audioContext = new webkitAudioContext();
    }
  }
  return new SoundFx(SoundFx.audioContext);
};

SoundFx.prototype.createGain = function() {
  if (this.ctx.createGain) {
    return this.ctx.createGain();
  }
  if (this.ctx.createGainNode) {
    return this.ctx.createGainNode();
  }
  return null;
};

SoundFx.prototype.setCenter = function(x, y) {
  if (!this.ctx) return;
  this.ctx.listener.setPosition(x, y, SoundFx.Z_DISTANCE);
};

SoundFx.prototype.getMasterGainNode = function() {
  return this.masterGainNode;
};

/**
 * Make a simple one-shot sound.
 * @param {Vec2d} pos
 * @param {number} vol
 * @param {number} attack
 * @param {number} decay
 * @param {number} freq1
 * @param {number} freq2
 * @param {String} type Wave type string (square, sine, etc)
 */
SoundFx.prototype.sound = function(pos, vol, attack, decay, freq1, freq2, type, opt_delay) {
  var delay = opt_delay || 0;
  if (!this.ctx) return;
  vol *= SoundFx.Z_DISTANCE;
  var c = this.ctx;
  var t0 = c.currentTime + delay;
  var t1 = t0 + attack + decay + 0.1;
  var gain = this.createGain();
  gain.gain.value = 0;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + attack);
  gain.gain.linearRampToValueAtTime(0, t0 + attack + decay);

  var osc = c.createOscillator();
  osc.frequency.setValueAtTime(freq1, t0);
  osc.frequency.exponentialRampToValueAtTime(freq2, t0 + attack + decay);
  osc.type = type;
  if (osc.start) {
    osc.start(t0);
  } else if (osc.noteOn) {
    osc.noteOn(t0);
  }
  if (osc.stop) {
    osc.stop(t1);
  } else if (osc.noteOff) {
    osc.noteOff(t1);
  }

  var panner = c.createPanner();
  panner.setPosition(pos.x, pos.y, 0);

  osc.connect(gain);
  gain.connect(panner);
  panner.connect(this.masterGainNode);
};

SoundFx.prototype.disconnect = function() {
  if (this.masterGainNode) {
    this.masterGainNode.gain = 0;
    this.masterGainNode.disconnect();
    this.masterGainNode = null;
  }
};

