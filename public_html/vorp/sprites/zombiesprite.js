/**
 * @constructor
 * @extends {Sprite}
 */
function ZombieSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.mass = 1;

  this.pos = new Vec2d();
  this.vec = new Vec2d();
}
ZombieSprite.prototype = new Sprite(null);
ZombieSprite.prototype.constructor = ZombieSprite;

ZombieSprite.FWD_ACCEL = 0.1;
ZombieSprite.RAND_ACCEL = 0.2;
ZombieSprite.APPROACH_PLAYER_ACCEL = 0.5;
ZombieSprite.OBSTACLE_SCAN_RANGE = 60;
ZombieSprite.PLAYER_SCAN_RANGE = 600;

ZombieSprite.prototype.act = function() {
  this.addFriction(Vorp.FRICTION);
  this.approachPlayer();
  this.avoidObstacles();
};

ZombieSprite.prototype.avoidObstacles = function() {
  var p = this.getPos(this.pos);
  var v = this.vec;

  var p2 = this.getVel(v).scaleToLength(ZombieSprite.OBSTACLE_SCAN_RANGE).add(p);
  var rayScan = RayScan.alloc(
      p.x, p.y,
      p2.x, p2.y,
      this.rad.x/2, this.rad.y/2);
  var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
  var fwdFactor = 1;
  var randFactor = 1;
  if (hitSpriteId) {
    fwdFactor = -0.5;
    randFactor = 0.5;
  }
  RayScan.free(rayScan);

  this.getVel(v).scaleToLength(Math.random() * ZombieSprite.FWD_ACCEL * fwdFactor);
  this.accelerate(v);

  v.setXY(0, randFactor * ZombieSprite.RAND_ACCEL).rot(Math.random() * 2 * Math.PI);
  this.accelerate(v);
};

ZombieSprite.prototype.approachPlayer = function() {
  var player = this.world.getPlayerSprite();
  if (!player || player.zombieness) {
    return;
  }
  var p = this.getPos(this.pos);
  var v = player.getPos(this.vec);
  if (!v) return false;
  var foundPlayer = false;
  var rayScan = RayScan.alloc(
      p.x, p.y,
      v.x, v.y,
      1, 1);
  var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
  if (this.world.isPlayerSpriteId(hitSpriteId)) {
    v.subtract(p).scaleToLength(Math.random() * ZombieSprite.APPROACH_PLAYER_ACCEL).rot(Math.random() - 0.5);
    this.accelerate(v);
    foundPlayer = true;
  }
  RayScan.free(rayScan);
  return foundPlayer;
};

ZombieSprite.prototype.onSpriteHit = function(hitSprite) {
  if (this.world.isPlayerSpriteId(hitSprite.id)) {
    this.world.getPlayerSprite().touchedByAZombie();
  }
  return true;
};
