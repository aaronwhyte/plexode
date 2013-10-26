/**
 * @constructor
 * @extends {Singer}
 */
function ZapperSinger() {
  Singer.call(this);

  // audio nodes
  this.oscillator = null;
  this.panner = null;
  this.masterGain = null;

  this.active = false;
  this.rad = new Vec2d();
}
ZapperSinger.prototype = new Singer();
ZapperSinger.prototype.constructor = ZapperSinger;

//ZapperSinger.prototype.advance = function(now) {
//  this.now = now;
//};

ZapperSinger.prototype.setRadXY = function(x, y) {
  this.rad.setXY(x, y);
};

ZapperSinger.prototype.setActive = function(a) {
  this.active = a;
};

ZapperSinger.prototype.sing = function(vorpOut, x, y) {
  var sfx = vorpOut.soundFx;
  if (!sfx || !sfx.ctx) return;
  var c = sfx.ctx;
  if (!this.masterGain) {
    this.initNodes(sfx);
  }
  if (this.active) {
    this.panner.setPosition(
        this.pos.x + (Math.random() - 0.5) * 2 + this.rad.x,
        this.pos.y + (Math.random() - 0.5) * 2 + this.rad.y,
        0);
    sfx.sound(this.pos,
        0.2 * (0.3 + 0.3 * this.kick) / voices,
        0.001, length,
        p, p/4,
        'sawtooth');
  }
};

ZapperSinger.prototype.initNodes = function(sfx) {
  var c = sfx.ctx;
  var t = c.currentTime;

  this.oscillator = c.createOscillator();
  this.oscillator.frequency.value = 2000;
  this.oscillator.type = 'sawtooth';
  this.oscillator.start(t);
  this.masterGain = c.createGainNode();
  this.masterGain.gain.value = 2;
  this.panner = c.createPanner();
  this.masterGain.connect(this.panner);
  this.panner.connect(sfx.getMasterGainNode());
};

ZapperSinger.prototype.isKaput = function() {
  return this.now >= this.dieTime;
};

ZapperSinger.prototype.die = function() {
  this.dieTime = this.now + ZapperSinger.DEATH_DURATION;
  this.dying = true;
  this.masterGain.gain.value = 0;
};

ZapperSinger.prototype.setThrusting = function(thrustFraction, speed) {
  this.thrustFraction = thrustFraction;
  this.speed = speed;
};

ZapperSinger.prototype.setTractoring = function(seekFraction, holdFraction) {
  this.seekFraction = seekFraction;
  this.holdFraction = holdFraction;
};

ZapperSinger.prototype.setKick = function(kick) {
  this.kick = kick;
};