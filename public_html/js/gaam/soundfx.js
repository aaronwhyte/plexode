/**
 * Util for producing short sound effects.
 * @param {AudioContext} audioContext
 * @constructor
 */
function SoundFx(audioContext) {
  this.ctx = audioContext;
}

SoundFx.Z_DISTANCE = 200;

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
  this.ctx.listener.setPosition(x, y, SoundFx.Z_DISTANCE);
};

SoundFx.prototype.sound = function(pos, vol, attack, decay, freq1, freq2, type) {
  if (!this.ctx) return;
  vol *= SoundFx.Z_DISTANCE;
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