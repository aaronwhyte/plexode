/**
 * A Sprite is an object in the game world.
 * @param {SpriteTemplate=} spriteTemplate, null for new prototype sprites
 * @constructor
 */
function Sprite(spriteTemplate) {
  this.acceleration = new Vec2d();
  this.pos0 = new Vec2d();
  this.vel = new Vec2d();
  this.rad = new Vec2d();
  this.reset(spriteTemplate);
}

/**
 * @param {SpriteTemplate=} spriteTemplate
 */
Sprite.prototype.reset = function(spriteTemplate) {
  if (spriteTemplate) {
    this.gameClock = spriteTemplate.gameClock;
    this.painter = spriteTemplate.painter;
    this.sledgeInvalidator = spriteTemplate.sledgeInvalidator;
    this.world = spriteTemplate.world;
    // pos0 is the position at time t0. Use getPos() to get the current position.
    this.pos0.set(spriteTemplate.pos);
    this.vel.set(spriteTemplate.vel);
    this.rad.set(spriteTemplate.rad);
    this.mass = spriteTemplate.mass;
    this.group = spriteTemplate.group;
    this.sledgeDuration = spriteTemplate.sledgeDuration;

    /** @type {number} */
    this.t0 = this.now();
  }
  this.id = null;
  this.acceleration.setXY(0, 0);
};

/**
 * This is where sprites rayscan, set acceleration, and plan to spawn or remove
 * other sprites, etc.
 * @return commands for the game to consume, like killPlayer, exitToUrl, etc.
 */
Sprite.prototype.act = function() {
  return null;
};


/**
 * Friction utility.
 * @param {number} friction, like 0.1 for 10% friction.
 */
Sprite.prototype.addFriction = function(friction) {
  var accel = this.getVel(Vec2d.alloc());
  accel.scale(-friction);
  this.accelerate(accel);
  Vec2d.free(accel);
};


/**
 * This is where sprites apply their acceleration and other changes.
 */
Sprite.prototype.affect = function() {
  if (!this.acceleration.isZero()) {
    this.addVel(this.acceleration);
    this.acceleration.setXY(0, 0);
  }
};

/**
 * Convenience func to add acceleration.
 * @param {Vec2d} v
 */
Sprite.prototype.accelerate = function(v) {
  this.acceleration.add(v);
};

/**
 * @return {Painter}
 */
Sprite.prototype.getPainter = function() {
  return this.painter;
};

/**
 * @param {SpriteTimeout} spriteTimeout
 * @return game commands
 */
Sprite.prototype.onTimeout = function(spriteTimeout) {
  return null;
};

/**
 * @param {Sprite} hitSprite
 * @return game commands
 */
Sprite.prototype.onSpriteHit = function(hitSprite) {
  return null;
};

Sprite.prototype.setVel = function(vec) {
  if (this.vel.equals(vec)) return;
  var now = this.now();
  if (this.t0 != now) {
    // Move position along path, to the current time.
    var temp = Vec2d.alloc();
    temp.set(this.vel).scale(now - this.t0);
    this.pos0.add(temp);
    Vec2d.free(temp);
    this.t0 = now;
  }
  this.vel.set(vec);
  this.invalidateSledge();
};

/**
 * Directly add velocity.
 * Call from onSpriteHit(), but not from act() or affect().
 * @param {Vec2d} vec
 */
Sprite.prototype.addVel = function(vec) {
  var temp = Vec2d.alloc();
  temp.set(vec).add(this.vel);
  this.setVel(temp);
  Vec2d.free(temp);
};

/**
 * Directly change position.
 * Call from onSpriteHit(), but not from act() or affect().
 * @param {Vec2d} vec
 */
Sprite.prototype.setPos = function(vec) {
  this.pos0.set(vec);
  this.t0 = this.now();
  this.invalidateSledge();
};

/**
 * Directly change radius.
 */
Sprite.prototype.setRad = function(vec) {
  this.rad.set(vec);
  this.invalidateSledge();
};

/**
 * @param {Vec2d} vecOut
 * @returns {Vec2d}
 */
Sprite.prototype.getPos = function(vecOut) {
  return vecOut
      .set(this.vel)
      .scale(this.now() - this.t0)
      .add(this.pos0);
};

/**
 * @param {Vec2d} vecOut
 * @returns {Vec2d}
 */
Sprite.prototype.getVel = function(vecOut) {
  return vecOut.set(this.vel);
};

/**
 * @param {Vec2d} vecOut
 * @returns {Vec2d}
 */
Sprite.prototype.getRad = function(vecOut) {
  return vecOut.set(this.rad);
};

/**
 * Notifies physics system that this sprite's sledge is invalid.
 */
Sprite.prototype.invalidateSledge = function() {
  this.sledgeInvalidator.add(this.id);
};

/**
 * Allocates and returns a new sledge.
 * Also logs a paint event.
 * @return {Sledge}
 */
Sprite.prototype.createSledge = function() {
  var sledge = Sledge.alloc(
      this.pos0.x, this.pos0.y,
      this.vel.x, this.vel.y,
      this.rad.x, this.rad.y,
      this.t0,
      this.now() + this.sledgeDuration);

  if (this.painter) {
    sledge.moveToTime(this.now());
    var paintEvent = PaintEvent.alloc(
        PaintEvent.Type.PATH, this.now(),
        sledge.px, sledge.py,
        sledge.vx, sledge.vy,
        sledge.rx, sledge.ry);
    this.painter.addEvent(paintEvent);
  }
  return sledge;
};

/**
 * @return {number}
 */
Sprite.prototype.now = function() {
  return this.gameClock.getTime();
};

/**
 * @return {number}
 */
Sprite.prototype.area = function() {
  return this.rad.x * this.rad.y;
};
