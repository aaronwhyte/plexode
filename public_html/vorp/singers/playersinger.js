/**
 * @constructor
 * @extends {Singer}
 */
function PlayerSinger() {
  console.log('PlayerSinger()');
  Singer.call(this);
  this.dieTime = Infinity;
  this.dying = false;
  this.now = 0;
  this.thrusting = false;
  this.thrustFraction = 0;
  this.speed = 0;

  // audio nodes
  this.wubOsc = null;
  this.wubGain = null;
  this.droneOsc = null;
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
  if (!sfx) return;
  var c = sfx.ctx;
  var t = c.currentTime;
  if (!this.masterGain) {
    this.initNodes(c);
  }
  if (!this.dying) {
    this.panner.setPosition(this.pos.x, this.pos.y, 0);
    this.masterGain.gain.value = (this.thrustFraction || this.speed > 10) ? this.thrustFraction + 0.2 : 0;
    this.wubOsc.frequency.value = 5 + 40 * this.thrustFraction;
    this.droneOsc.frequency.value = 5 + 12 * this.speed;
  }
};

PlayerSinger.prototype.initNodes = function(c) {
  this.wubOsc = c.createOscillator();
  this.wubOsc.type = 'sine';

  this.wubGain = c.createGainNode();

  this.droneOsc = c.createOscillator();
  this.droneOsc.type = 'square';

  this.masterGain = c.createGainNode();

  this.panner = c.createPanner();
  this.panner.setPosition(this.pos.x, this.pos.y, 0);

  var t = c.currentTime;
  this.wubOsc.start(t);
  this.droneOsc.start(t);

  this.droneOsc.connect(this.wubGain);
  this.wubOsc.connect(this.wubGain.gain);
  this.wubGain.connect(this.masterGain);
  this.masterGain.connect(this.panner);
  this.panner.connect(c.destination);
};

PlayerSinger.prototype.isKaput = function() {
  return this.now >= this.dieTime;
};

PlayerSinger.prototype.die = function() {
  this.dieTime = this.now + PlayerSinger.DEATH_DURATION;
  this.dying = true;
  this.masterGain.gain.value = 0;
};

PlayerSinger.prototype.setThrusting = function(thrusting, thrustFraction, speed) {
  this.thrusting = thrusting;
  this.thrustFraction = thrustFraction;
  this.speed = speed;
};