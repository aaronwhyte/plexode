/**
 * A Sprite is an object in the game world.
 * @param {Phy} phy
 * @param {Painter} painter
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @param {number} mass
 * @param {number} group
 * @param {number} sledgeDuration
 * @constructor
 */
function Sprite(phy, painter, px, py, vx, vy, rx, ry, mass, group, sledgeDuration) {
  this.acceleration = new Vec2d();
  this.reset(phy, painter, px, py, vx, vy, rx, ry, mass, group, sledgeDuration);
}

/**
 * @param {Phy} phy
 * @param {Painter} painter
 * @param {number} px
 * @param {number} py
 * @param {number} vx
 * @param {number} vy
 * @param {number} rx
 * @param {number} ry
 * @param {number} mass
 * @param {number} sledgeDuration
 */
Sprite.prototype.reset = function(phy, painter, px, py, vx, vy, rx, ry, mass, group, sledgeDuration) {
  this.phy = phy;
  this.painter = painter;
  this.px = px;
  this.py = py;
  this.vx = vx;
  this.vy = vy;
  this.rx = rx;
  this.ry = ry;
  this.mass = mass;
  this.group = group;
  this.sledgeDuration = sledgeDuration;

  /** @type {number} */
  this.t0 = this.now();

  this.id = -1;

  this.acceleration.setXY(0, 0);
};

/**
 * Override this to make cool stuff happen.
 */
Sprite.prototype.act = function(game) {};

/**
 * Override this to make cool stuff happen.
 */
Sprite.prototype.affect = function(game) {
  this.addVelXY(this.acceleration.x, this.acceleration.y);
  this.acceleration.setXY(0, 0);
};

Sprite.prototype.accelerate = function(v) {
  this.acceleration.add(v);
};

Sprite.prototype.accelerateXY = function(x, y) {
  this.acceleration.addXY(x, y);
};

/**
 * Inject a painter into your sprite constructor and call it "painter".
 * @return {Painter?} Might be null, if the sprite isn't using painters yet.
 */
Sprite.prototype.getPainter = function() {
  return this.painter;
};

/**
 * @param {SpriteTimeout} spriteTimeout
 */
Sprite.prototype.onTimeout = function(spriteTimeout) {};

/**
 * @param {Sprite} hitSprite
 */
Sprite.prototype.onSpriteHit = function(hitSprite) {};

/**
 * @param {number} x
 * @param {number} y
 */
Sprite.prototype.setVelXY = function(x, y) {
  var now = this.now();
  if (this.vx == x && this.vy == y) return;
  if (this.t0 != now) {
    this.px = this.px + (now - this.t0) * this.vx;
    this.py = this.py + (now - this.t0) * this.vy;
  }
  this.vx = x;
  this.vy = y;
  this.t0 = now;
  this.invalidateSledge();
};

/**
 * @param {number} x
 * @param {number} y
 */
Sprite.prototype.addVelXY = function(x, y) {
  this.setVelXY(this.vx + x, this.vy + y);
};

/**
 * @param {Vec2d} vec
 */
Sprite.prototype.addVel = function(vec) {
  this.setVelXY(this.vx + vec.x, this.vy + vec.y);
};

/**
 * @param {Vector2d} vec
 */
Sprite.prototype.setPos = function(vec) {
  this.px = vec.x;
  this.py = vec.y;
  this.t0 = this.now();
  this.invalidateSledge();
};

/**
 * @param {number} x
 * @param {number} y
 */
Sprite.prototype.setPosXY = function(x, y) {
  this.px = x;
  this.py = y;
  this.t0 = this.now();
  this.invalidateSledge();
};

/**
 * @param {number} x
 * @param {number} y
 */
Sprite.prototype.setRadXY = function(x, y) {
  this.rx = x;
  this.ry = y;
  this.invalidateSledge();
};

/**
 * @param {Vec2d} vecOut
 * @returns {Vec2d}
 */
Sprite.prototype.getPos = function(vecOut) {
  var time = this.now();
  vecOut.x = this.px + (time - this.t0 )* this.vx;
  vecOut.y = this.py + (time - this.t0 )* this.vy;
  return vecOut;
};

/**
 * @param {Vec2d} vecOut
 * @returns {Vec2d}
 */
Sprite.prototype.getVel = function(vecOut) {
  vecOut.x = this.vx;
  vecOut.y = this.vy;
  return vecOut;
};

/**
 * @param {Vec2d} vecOut
 * @returns {Vec2d}
 */
Sprite.prototype.getRad = function(vecOut) {
  vecOut.x = this.rx;
  vecOut.y = this.ry;
  return vecOut;
};

Sprite.prototype.invalidateSledge = function() {
  this.phy.invalidateSledgeForSpriteId(this.id);
};

/**
 * @return {Sledge}
 */
Sprite.prototype.createSledge = function() {
  var sledge = Sledge.alloc(this.px, this.py, this.vx, this.vy, this.rx, this.ry, this.t0,
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
  return this.phy ? this.phy.getNow() : 0;
};

Sprite.prototype.overlaps = function(that) {
  var thisPos = this.getPos(Vec2d.alloc());
  var thatPos = that.getPos(Vec2d.alloc());
  var retval = Math.abs(thisPos.x - thatPos.x) < this.rx + that.rx &&
      Math.abs(thisPos.y - thatPos.y) < this.ry + that.ry;
  Vec2d.free(thisPos);
  Vec2d.free(thatPos);
  return retval;
};
