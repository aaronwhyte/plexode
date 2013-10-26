/**
 * @constructor
 * @extends {Singer}
 */
function PlayerSinger() {
  Singer.call(this);
  this.dieTime = Infinity;
  this.dying = false;
  this.now = 0;
  this.thrustFraction = 0;
  this.seekFraction = 0;
  this.holdFraction = 0;
  this.speed = 0;
  this.kick = 0;

  // audio nodes
  this.thrustWub = null;
  this.thrustGain = null;

  this.tractorSeekWub = null;
  this.tractorHoldWub = null;
  this.tractorGain = null;

  this.masterGain = null;
  this.panner = null;
}
PlayerSinger.prototype = new Singer();
PlayerSinger.prototype.constructor = PlayerSinger;

PlayerSinger.DEATH_DURATION = 30;

PlayerSinger.prototype.advance = function(now) {
  this.now = now;
};

PlayerSinger.prototype.sing = function(vorpOut, x, y) {
  var sfx = vorpOut.soundFx;
  if (!sfx || !sfx.ctx) return;
  if (!this.masterGain) {
    this.initNodes(sfx);
  }
  if (!this.dying) {
    this.panner.setPosition(this.pos.x, this.pos.y, 150);

    // movement noises
    var s = this.speed / 30;
    var t = this.thrustFraction;
    if (t) t = 0.3 + this.thrustFraction * 0.7;
    var thrustVal = s * 0.7 + t * 0.3;
    if (thrustVal < 0.01) thrustVal = 0;
    this.thrustWub.setValue(thrustVal);
    this.thrustGain.gain.value = thrustVal ? 1 : 0;

    // tractor noises
    this.tractorSeekWub.setValue(this.seekFraction);
    this.tractorHoldWub.setValue(this.holdFraction);
    if (this.kick) {
      var pitch = Math.random() * 20 + 1500 - 100 * this.kick;
      var length = 0.07 + 0.12 * this.kick;
      var voices = 2;
      for (var i = 0; i < voices; i++) {
        var p = pitch / Math.pow(2, i);
        sfx.sound(this.pos,
            0.2 * (0.3 + 0.3 * this.kick) / voices,
            0.001, length,
            p, p/4,
            'sawtooth');
        sfx.sound(this.pos,
            0.015 * (0.2 + 0.3 * this.kick) / voices,
            0.001, length,
            p, p/4,
            'sine');
      }
      this.kick = 0;
    }
  }
};

PlayerSinger.prototype.initNodes = function(sfx) {
  var c = sfx.ctx;
  var t = c.currentTime;

  // thrust
  this.thrustWub = new WubOscillator(
      30, 500,
      5, 20,
      0.5, 0.6,
      'square');
  this.thrustWub.createNodes(c);
  this.thrustWub.setValue(0);
  this.thrustWub.start(t);
  this.thrustGain = c.createGainNode();
  this.thrustGain.gain.value = 1.5;
  this.thrustWub.connect(this.thrustGain);

  this.tractorGain = c.createGainNode();
  this.tractorGain.gain.value = 3;

  // tractor seek
  this.tractorSeekWub = new WubOscillator(
      125, 1000,
      20, 30,
      0, 0.5,
      'sawtooth');
  this.tractorSeekWub.createNodes(c);
  this.tractorSeekWub.setValue(0);
  this.tractorSeekWub.start(t);
  this.tractorSeekWub.connect(this.tractorGain);

  // tractor hold
  this.tractorHoldWub = new WubOscillator(
      1000, 100,
      100, 5,
      0, 0.7,
      'square');
  this.tractorHoldWub.createNodes(c);
  this.tractorHoldWub.setValue(0);
  this.tractorHoldWub.start(t);
  this.tractorHoldWub.connect(this.tractorGain);

  this.masterGain = c.createGainNode();
  this.masterGain.gain.value = 1;
  this.panner = c.createPanner();

  this.thrustGain.connect(this.masterGain);
  this.tractorGain.connect(this.masterGain);
  this.masterGain.connect(this.panner);
  this.panner.connect(sfx.getMasterGainNode());
};

PlayerSinger.prototype.isKaput = function() {
  return this.now >= this.dieTime;
};

PlayerSinger.prototype.die = function() {
  this.dieTime = this.now + PlayerSinger.DEATH_DURATION;
  this.dying = true;
  this.masterGain.gain.value = 0;
};

PlayerSinger.prototype.setThrusting = function(thrustFraction, speed) {
  this.thrustFraction = thrustFraction;
  this.speed = speed;
};

PlayerSinger.prototype.setTractoring = function(seekFraction, holdFraction) {
  this.seekFraction = seekFraction;
  this.holdFraction = holdFraction;
};

PlayerSinger.prototype.setKick = function(kick) {
  this.kick = kick;
};