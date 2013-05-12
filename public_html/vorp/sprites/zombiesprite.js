/**
 * @constructor
 * @extends {Sprite}
 */
function ZombieSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.acc = new Vec2d();
}
ZombieSprite.prototype = new Sprite(null);
ZombieSprite.prototype.constructor = ZombieSprite;

ZombieSprite.FWD_ACCEL = 0.1;
ZombieSprite.RAND_ACCEL = 0.2;

ZombieSprite.prototype.act = function() {
  this.addFriction(Vorp.FRICTION);

  this.getVel(this.acc).scaleToLength(Math.random() * ZombieSprite.FWD_ACCEL);
  this.accelerate(this.acc);

  this.acc.setXY(0, ZombieSprite.RAND_ACCEL).rot(Math.random() * 2 * Math.PI);
  this.accelerate(this.acc);
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
