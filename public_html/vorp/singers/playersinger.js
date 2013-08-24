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
  this.speed = 0;

  // audio nodes
  this.thrustWub = null;
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
    var s = this.speed / 30;
    var t = this.thrustFraction;
    if (t) t = 0.3 + this.thrustFraction * 0.7;
    this.thrustWub.setValue(s * 0.7 + t * 0.3);
  }
};

PlayerSinger.prototype.initNodes = function(c) {
  var t = c.currentTime;

  this.thrustWub = new WubOscillator(
      30, 500,
      5, 90,
      0, 1.5);
  this.thrustWub.createNodes(c);
  this.thrustWub.setValue(0);
  this.thrustWub.start(t);

  this.masterGain = c.createGainNode();
  this.masterGain.gain.value = 1.5;
  this.panner = c.createPanner();

  this.thrustWub.connect(this.masterGain);
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