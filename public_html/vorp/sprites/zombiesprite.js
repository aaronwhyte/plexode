/**
 * @constructor
 * @extends {Sprite}
 */
function ZombieSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
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
  var p = this.getPos(this.pos);
  var v = this.world.getPlayerPos(this.vec);
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


///**
// * @param {Vec2d} vec  line down the center of the scan arc
// * @param {number} arc  number from 0 to 1 indicating
// * what fraction of the circle to cover.  1 means a full circle.
// * @param {number} scans  number of steps in the scan sweep.
// */
//ZombieSprite.prototype.gripScanSweep = function(vec, arc, scans) {
//  var p = this.getPos(this.pos);
//  var minTime = Infinity;
//  for (var i = 0; i < scans; i++) {
//    this.scanVec.set(vec);
//    this.scanVec.rot(arc * (i / (scans - 1) - 0.5) * 2 * Math.PI +
//        (Math.random() - 0.5) * 2 * Math.PI * arc / scans);
//    var rayScan = RayScan.alloc(
//        p.x, p.y,
//        p.x + this.scanVec.x, p.y + this.scanVec.y,
//        5, 5);
//    var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
//    if (hitSpriteId && rayScan.time < minTime) {
//      var sprite = this.world.getSprite(hitSpriteId);
//      if (sprite.mass < Infinity) {
//        this.heldSprite = sprite;
//        this.grip = ZombieSprite.Grip.LOOSE;
//        if (this.canGrip) {
//          // Not any more.
//          this.canGrip = false;
//          //this.painter.clearRayScans();
//        }
//        // Pick the closest target.
//        minTime = rayScan.time;
//      }
//    }
//    this.painter.addRayScan(rayScan);
//    RayScan.free(rayScan);
//  }
//};
