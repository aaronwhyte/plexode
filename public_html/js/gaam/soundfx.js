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


SoundFx.prototype.r = function(x) {
  var f = 0.3;
  return x += x * f * (Math.random() - f/2);
};

SoundFx.prototype.tap = function(vol) {
  // TODO: x, y, for panner
  this.sound(this.r(vol), 0, 0.005, this.r(1000), this.r(2000), 'sine');
  this.sound(this.r(vol), 0, 0.005, this.r(2000), this.r(1000), 'sine');
};

SoundFx.prototype.chirp = function() {
  var attack = this.r(0.01);
  var decay = this.r(0.02);
  var freq1 = this.r(4000);
  for (var i = 0; i <2; i++) {
    this.sound(0.1, attack, decay, freq1, this.r(1000), 'sine');
  }
};


SoundFx.prototype.sound = function(vol, attack, decay, freq1, freq2, type) {
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

  osc.connect(gain);
  gain.connect(c.destination);
};


function makeWebStormHappy() {
  AudioContext = 1;
  webkitAudioContext = 1;
  x = {
    createGainNode:1,
    gain:1,
    setValueAtTime: 1,
    linearRampToValueAtTime: 1,
    createOscillator: 1,
    frequency: 1,
    exponentialRampToValueAtTime:1,
    connect:1,
    destination:1,
    type:1,
  };
}