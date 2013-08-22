/**
 * @constructor
 */
function SpriteTemplate() {
  this.gameClock = null;
  this.sledgeInvalidator = null;
  this.world = null;
  this.painter = null;
  this.singer = null;
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.rad = new Vec2d();
  this.mass = null;
  this.group = null;
  this.sledgeDuration = null;
}

SpriteTemplate.prototype.setGameClock = function(gameClock) {
  this.gameClock = gameClock;
  return this;
};

SpriteTemplate.prototype.setSledgeInvalidator = function(sledgeInvalidator) {
  this.sledgeInvalidator = sledgeInvalidator;
  return this;
};

SpriteTemplate.prototype.setWorld = function(world) {
  this.world = world;
  return this;
};

SpriteTemplate.prototype.setSinger = function(singer) {
  this.singer = singer;
  return this;
};

SpriteTemplate.prototype.setPainter = function(painter) {
  this.painter = painter;
  return this;
};

SpriteTemplate.prototype.setPos = function(pos) {
  this.pos.set(pos);
  return this;
};

SpriteTemplate.prototype.setVel = function(vel) {
  this.vel.set(vel);
  return this;
};

SpriteTemplate.prototype.setRad = function(rad) {
  this.rad.set(rad);
  return this;
};

SpriteTemplate.prototype.setPosXY = function(x, y) {
  this.pos.setXY(x, y);
  return this;
};

SpriteTemplate.prototype.setVelXY = function(x, y) {
  this.vel.setXY(x, y);
  return this;
};

SpriteTemplate.prototype.setRadXY = function(x, y) {
  this.rad.setXY(x, y);
  return this;
};

SpriteTemplate.prototype.setMass = function(mass) {
  this.mass = mass;
  return this;
};

SpriteTemplate.prototype.setGroup = function(group) {
  this.group = group;
  return this;
};

SpriteTemplate.prototype.setSledgeDuration = function(sledgeDuration) {
  this.sledgeDuration = sledgeDuration;
  return this;
};
