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
  this.hurlDelay = 0;
  this.health = 1;
}
PlayerSprite.prototype = new Sprite();
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.GRIP_RANGE = 150;
PlayerSprite.HURL_DELAY = 30;
PlayerSprite.BULLET_SPEED = 5;
PlayerSprite.BULLET_DURATION = 10;

PlayerSprite.ACCEL = 3;

PlayerSprite.GRIP_FORCE = 8;
PlayerSprite.KICK = 50000;

PlayerSprite.prototype.setFlailSprite = function(s) {
  this.flail = s;
};

PlayerSprite.prototype.act = function(phy, game) {
  // move
  var workVec = Vec2d.alloc(0, 0);
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);
  if (this.health > 0) {
    GU_copyKeysVec(this.keysVec);
    if (this.keysVec.x || this.keysVec.y) {
      workVec.add(this.keysVec.scaleToLength(PlayerSprite.ACCEL));
    }
  }
  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);

  if (this.health > 0) {
    this.doFlailStuff(phy, game);
  }
};

PlayerSprite.prototype.doFlailStuff = function(phy, game) {
  GU_copyKeysVec(this.keysVec);
  if (this.keysVec.x || this.keysVec.y) {
    this.keysVec.scaleToLength(PlayerSprite.GRIP_RANGE);
    this.initStiffPose(this.keysVec.x, this.keysVec.y);
  }
  this.stiffForce();
  this.hurlDelay = Math.max(0, --this.hurlDelay);
  if (this.hurlKeyDown() && !this.hurlDelay) {
    this.hurl(phy, game);
  }
  var dx = this.px - this.flail.px;
  var dy = this.py - this.flail.py;
  var randAngle = 2 * Math.PI * Math.random();
  var randDist = Math.random() * 5;
  var cx = Math.sin(randAngle) * randDist;
  var cy = Math.cos(randAngle) * randDist;
  var dist = Math.sqrt(dx * dx + dy * dy);
  var bullet = new PlayerBulletSprite(
      phy, game,
      this.flail.px, this.flail.py,
      this.flail.vx - PlayerSprite.BULLET_SPEED * dx / dist + cx,
      this.flail.vy - PlayerSprite.BULLET_SPEED * dy / dist + cy,
      PlayerSprite.BULLET_DURATION);
  game.addSprite(bullet);
};

PlayerSprite.prototype.onSpriteHit = function(hitSprite) {
  if (this.health <= 0) return;
  if (hitSprite instanceof EnemySprite && hitSprite.health > 0) {
    this.health--;
    if (this.health <= 0) {
      this.painter.setColor("#222");
    }
  }
};

PlayerSprite.prototype.getForceMultiplier = function() {
  var m = Math.max(0, (PlayerSprite.HURL_DELAY - this.hurlDelay) / PlayerSprite.HURL_DELAY);
  return m * m;
};


PlayerSprite.prototype.initStiffPose = function(dx, dy) {
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
  var fx = this.getForceMultiplier() * PlayerSprite.GRIP_FORCE * (damp * dVel.x - pull * dx);
  var fy = this.getForceMultiplier() * PlayerSprite.GRIP_FORCE * (damp * dVel.y - pull * dy);
  this.accelerateXY(-fx / this.mass, -fy / this.mass);
  this.flail.accelerateXY(fx / this.flail.mass, fy / this.flail.mass);
  Vec2d.free(dVel);
};

PlayerSprite.prototype.hurl = function(phy, game) {
  this.hurlDelay = PlayerSprite.HURL_DELAY;
  var dx = this.flail.px - this.px;
  var dy = this.flail.py - this.py;
  var dist = Math.sqrt(dx * dx + dy * dy);

  var flailAcc = PlayerSprite.KICK / this.flail.mass;
  this.flail.accelerateXY(flailAcc * dx / dist, flailAcc * dy / dist);
  var plrAcc = -PlayerSprite.KICK / this.mass;
  this.accelerateXY(plrAcc * dx / dist, plrAcc * dy / dist);
};

/**
 * @return {boolean}
 */
PlayerSprite.prototype.hurlKeyDown = function() {
  return GU_keys[VK_X] || GU_keys[VK_Q];
};

