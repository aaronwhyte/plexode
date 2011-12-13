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
      radius * radius * 4, // mass
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
  this.fireDelay = 0;
}
PlayerSprite.prototype = new Sprite();
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.GRIP_RANGE = 140;
PlayerSprite.FIRE_DELAY = 40;
PlayerSprite.BULLET_SPEED = 60;

PlayerSprite.ACCEL = 3;

PlayerSprite.FORCE = 9;
PlayerSprite.KICK = 40000;

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

  this.fireDelay = Math.max(0, --this.fireDelay);
  if (this.fireKeyDown() && !this.fireDelay) {
    this.fire(phy, game);
  }
};

PlayerSprite.prototype.getForceMultiplier = function() {
  var m = Math.max(0, (PlayerSprite.FIRE_DELAY - this.fireDelay) / PlayerSprite.FIRE_DELAY);
  return m * m;
};

PlayerSprite.prototype.looseForce = function() {
  var dx = this.px - this.flail.px;
  var dy = this.py - this.flail.py;
  var dist = Math.sqrt(dx * dx + dy * dy);

  var aimUnit = Vec2d.alloc(dx / dist, dy / dist);
  var pull = 7 * (dist - PlayerSprite.GRIP_RANGE);
  var dVel = Vec2d.alloc(this.vx - this.flail.vx, this.vy - this.flail.vy);
  var dPos = Vec2d.alloc(dx, dy);
  dPos.scaleToLength(1);
  var dot = dVel.dot(dPos);
  var damp = dot * 15;
  var fx = this.getForceMultiplier() * PlayerSprite.FORCE * (aimUnit.x * (pull + damp));
  var fy = this.getForceMultiplier() * PlayerSprite.FORCE * (aimUnit.y * (pull + damp));
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
  var damp = 15;
  var pull = 6;
  var fx = this.getForceMultiplier() * PlayerSprite.FORCE * (damp * dVel.x - pull * dx);
  var fy = this.getForceMultiplier() * PlayerSprite.FORCE * (damp * dVel.y - pull * dy);
  this.accelerateXY(-fx / this.mass, -fy / this.mass);
  this.flail.accelerateXY(fx / this.flail.mass, fy / this.flail.mass);
  Vec2d.free(dVel);
};

PlayerSprite.prototype.fire = function(phy, game) {
  this.fireDelay = PlayerSprite.FIRE_DELAY;
  var dx = this.flail.px - this.px;
  var dy = this.flail.py - this.py;
  var dist = Math.sqrt(dx * dx + dy * dy);

  var flailAcc = PlayerSprite.KICK / this.flail.mass;
  this.flail.accelerateXY(flailAcc * dx / dist, flailAcc * dy / dist);
  var plrAcc = -PlayerSprite.KICK / this.mass;
  this.accelerateXY(plrAcc * dx / dist, plrAcc * dy / dist);

//  var bullet = new PlayerBulletSprite(
//      phy, game,
//      this.flail.px, this.flail.py,
//      this.flail.vx + PlayerSprite.BULLET_SPEED * dx / dist,
//      this.flail.vy + PlayerSprite.BULLET_SPEED * dy / dist);
//  game.addSprite(bullet);
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

