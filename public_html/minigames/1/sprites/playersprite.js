/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerSprite(phy, px, py) {
  var radius = 20;
  Sprite.call(this, phy,
      new RectPainter("#f4a"),
      px, py,
      0, 0, // vel
      radius, radius, // size
      radius * 4, // mass
      Game.PLAYER_GROUP,
      1.01);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();

  this.heldPos = new Vec2d();
  this.keysVec = new Vec2d();

  this.acceleration = new Vec2d();

  this.flail = null;
  this.isStiff = false;
  this.stiffPose = new Vec2d();
  this.lastFireTime = 0;
}
PlayerSprite.prototype = new Sprite();
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.GRIP_RANGE = 100;
PlayerSprite.FIRE_DELAY = 10;

PlayerSprite.ACCEL = 3;

PlayerSprite.prototype.setFlailSprite = function(s) {
  this.flail = s;
};

PlayerSprite.prototype.act = function(phy, game) {
  // move
  var workVec = Vec2d.alloc(0, 0);
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);
  GU_copyKeysVec(this.keysVec);
  if (this.keysVec.x || this.keysVec.y) {
    workVec.add(this.keysVec.scaleToLength(PlayerSprite.ACCEL));
  }
  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);

  if (!this.isStiff && this.gripKeyDown()) {
    this.initStiffPose();
    this.isStiff = true;
  }
  if (this.isStiff && !this.gripKeyDown()) {
    this.isStiff = false;
  }
  if (this.isStiff) {
    this.stiffForce();
  } else {
    this.looseForce();
  }

  if (this.fireKeyDown() &&
      game.getNow() >= this.lastFireTime + PlayerSprite.FIRE_DELAY) {
    this.fireBullet(phy, game);
  }
};


PlayerSprite.prototype.looseForce = function() {
  var dx = this.px - this.flail.px;
  var dy = this.py - this.flail.py;
  var dist = Math.sqrt(dx * dx + dy * dy);

  var aimUnit = Vec2d.alloc(dx / dist, dy / dist);
  var pull = (dist - PlayerSprite.GRIP_RANGE) * 6;
  var dVel = Vec2d.alloc(this.vx - this.flail.vx, this.vy - this.flail.vy);
  var dPos = Vec2d.alloc(dx, dy);
  var dot = dVel.dot(dPos);
  var damp = dot * 0.1;
  var fx = aimUnit.x * (pull + damp);
  var fy = aimUnit.y * (pull + damp);
  this.accelerateXY(-fx / this.mass, -fy / this.mass);
  this.flail.accelerateXY(fx / this.flail.mass, fy / this.flail.mass);
  Vec2d.free(aimUnit);
  Vec2d.free(dVel);
  Vec2d.free(dPos);
};


PlayerSprite.prototype.initStiffPose = function() {
  var dx = this.flail.px - this.px;
  var dy = this.flail.py - this.py;
  var dist = Math.sqrt(dx * dx + dy * dy);
  this.stiffPose.setXY(
      PlayerSprite.GRIP_RANGE * dx / dist,
      PlayerSprite.GRIP_RANGE * dy / dist);
  this.isStiff = true;
};

PlayerSprite.prototype.stiffForce = function() {
  var dx = this.flail.px - (this.px + this.stiffPose.x);
  var dy = this.flail.py - (this.py + this.stiffPose.y);
  var dVel = Vec2d.alloc(this.vx - this.flail.vx, this.vy - this.flail.vy);
  var damp = 20;
  var pull = 10;
  var fx = damp * dVel.x - pull * dx;
  var fy = damp * dVel.y - pull * dy;
  this.accelerateXY(-fx / this.mass, -fy / this.mass);
  this.flail.accelerateXY(fx / this.flail.mass, fy / this.flail.mass);
  Vec2d.free(dVel);
};

PlayerSprite.prototype.fireBullet = function(phy, game) {
  this.lastFireTime = game.getNow();
  var dx = this.flail.px - this.px;
  var dy = this.flail.py - this.py;
  var dist = Math.sqrt(dx * dx + dy * dy);

  var speed = 60;
  var bullet = new PlayerBulletSprite(
      phy, game,
      this.flail.px, this.flail.py,
      this.flail.vx + speed * dx / dist, this.flail.vy + speed * dy / dist);
  game.addSprite(bullet);
};

/**
 * @return {boolean}
 */
PlayerSprite.prototype.gripKeyDown = function() {
  return GU_keys[VK_Z] || GU_keys[VK_SEMICOLON];
};

/**
 * @return {boolean}
 */
PlayerSprite.prototype.fireKeyDown = function() {
  return GU_keys[VK_X] || GU_keys[VK_Q];
};

