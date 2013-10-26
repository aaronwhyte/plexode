/**
 * Utils for producing sound effects positioned in 2D.
 * @param {AudioContext} audioContext
 * @constructor
 */
function SoundFx(audioContext) {
  this.ctx = audioContext;
  if (this.ctx) {
    this.masterGainNode = this.ctx.createGainNode();
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
  var gain = c.createGainNode();
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


function makeWebStormHappy() {
  AudioContext = 1;
  webkitAudioContext = 1;
  x = {
    createGainNode:1,
    createPanner:1,
    gain:1,
    setValueAtTime: 1,
    linearRampToValueAtTime: 1,
    createOscillator: 1,
    frequency: 1,
    exponentialRampToValueAtTime:1,
    connect:1,
    destination:1,
    listener:1,
    type:1,
    noteOn:1,
    noteOff:1
  };
}