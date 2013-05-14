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
ZombieSprite.RAND_ACCEL = 0.4;
ZombieSprite.APPROACH_PLAYER_ACCEL = 0.3;
ZombieSprite.AVOID_PLASMA_ACCEL = 0.3;
ZombieSprite.OBSTACLE_SCAN_RANGE = 70;
ZombieSprite.PLASMA_SCAN_RANGE = 80;
ZombieSprite.PLAYER_SCAN_RANGE = 500;

ZombieSprite.prototype.act = function() {
  this.addFriction(Vorp.FRICTION);
  this.avoidObstacles();
  if (!this.avoidPlasma()) {
    this.approachPlayer();
  }
};

ZombieSprite.prototype.avoidObstacles = function() {
  var p = this.getPos(this.pos);
  var v = this.vec;

  var fwdFactor = 1;
  var randFactor = 1;

  var p2 = this.getVel(v).scaleToLength(ZombieSprite.OBSTACLE_SCAN_RANGE).add(p);
  var rayScan = RayScan.alloc(
      p.x, p.y,
      p2.x, p2.y,
      this.rad.x, this.rad.y);
  var generalSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
  if (generalSpriteId) {
    fwdFactor = -0.5;
    randFactor = 0.5;
  }
  RayScan.free(rayScan);

  this.getVel(v).scaleToLength(Math.random() * ZombieSprite.FWD_ACCEL * fwdFactor);
  this.accelerate(v);

  v.setXY(0, randFactor * ZombieSprite.RAND_ACCEL).rot(Math.random() * 2 * Math.PI);
  this.accelerate(v);
};

ZombieSprite.prototype.avoidPlasma = function() {
  var p = this.getPos(this.pos);
  var v = this.vec;

  var fwdFactor = 1;
  var randFactor = 1;

  for (var i = 0; i < 3; i++) {
    var rot = Math.random() * 2 * Math.PI;
    var p2 = v.setXY(ZombieSprite.PLASMA_SCAN_RANGE, 0).rot(rot).add(p);
    var rayScan = RayScan.alloc(
        p.x, p.y,
        p2.x, p2.y,
        this.rad.x, this.rad.y);
    var plasmaSpriteId = this.world.rayScan(rayScan, Vorp.PLASMA_PROBE_GROUP);
    if (plasmaSpriteId) {
      v.setXY(rayScan.x0 - rayScan.x1, rayScan.y0 - rayScan.y1)
          .scaleToLength(ZombieSprite.AVOID_PLASMA_ACCEL);
      this.accelerate(v);
    }
    RayScan.free(rayScan);
  }

  return !!plasmaSpriteId;
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

ZombieSprite.prototype.die = function() {
  this.painter.die();
};