/**
 * Util for producing short sound effects.
 * @param {AudioContext} audioContext
 * @constructor
 */
function SoundFx(audioContext) {
  this.ctx = audioContext;
}

SoundFx.createInstance = function() {
  var ctx = null;
  if (typeof AudioContext !== 'undefined') {
    ctx = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
    ctx = new webkitAudioContext();
  }
  return new SoundFx(ctx);
};


SoundFx.prototype.setCenter = function(x, y) {
  if (!this.ctx) return;
  this.ctx.listener.setPosition(x, y, 100);
};

SoundFx.prototype.r = function(x) {
  var f = 0.3;
  return x += x * f * (Math.random() - f/2);
};

SoundFx.prototype.tap = function(pos, vol) {
  this.sound(pos, vol, 0, 0.005, this.r(1000), this.r(2000), 'square');
  this.sound(pos, vol, 0, 0.01, this.r(2000), this.r(1000), 'sine');
};

SoundFx.prototype.teleport = function(pos, exiting) {
  var attack, decay, freq1, freq2;
  if (exiting) {
    attack = 0.2;
    decay = 0.001;
    freq1 = this.r(50);
    freq2 = this.r(2000);
  } else {
    attack = 0.001;
    decay = 0.2;
    freq1 = this.r(2000);
    freq2 = this.r(50);
  }
  this.sound(pos, 0.2, attack, decay, freq1, freq2, 'square');
};


SoundFx.prototype.sound = function(pos, vol, attack, decay, freq1, freq2, type) {
  vol *= 100;
  var c = this.ctx;
  var t = c.currentTime;
  var gain = c.createGainNode();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + attack);
  gain.gain.linearRampToValueAtTime(0, t + attack + decay);

  var osc = c.createOscillator();
  osc.frequency.setValueAtTime(freq1, t);
  osc.frequency. exponentialRampToValueAtTime(freq2, t + attack + decay);
  osc.type = type;
  osc.start(t);
  osc.stop(t + attack + decay + 0.1);

  var panner = c.createPanner();
  panner.setPosition(pos.x, pos.y, 0);

  osc.connect(gain);
  gain.connect(panner);
  panner.connect(c.destination);
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
    type:1
  };
}