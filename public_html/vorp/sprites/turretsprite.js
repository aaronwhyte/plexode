/**
 * Turret that scans for stuff and shoots at it.
 * For now it's immobile, and fires plasma at zombies.
 * Seems friendly enough...
 * @constructor
 * @extends {Sprite}
 */
function TurretSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);

  this.pos = new Vec2d();

  this.scanVec = new Vec2d();
  this.scanInitVec = new Vec2d();

  this.lastFireTime = -Infinity;
}

TurretSprite.prototype = new Sprite(null);
TurretSprite.prototype.constructor = TurretSprite;

TurretSprite.SCAN_RANGE = 1000;
TurretSprite.PLASMA_SPEED = 20;
TurretSprite.COOLDOWN = 15;

TurretSprite.prototype.setTargetPos = function(vec) {
  this.targetPos = (new Vec2d()).set(vec);
  this.distToTarget = vec.distance(this.getPos(this.pos));
};

TurretSprite.prototype.act = function() {
  if (!this.targetPos || this.coolingDown()) return;
  this.scanInitVec.set(this.targetPos).subtract(this.getPos(this.pos));
  this.scanSweep(this.scanInitVec, 1/10, 1);
};

TurretSprite.prototype.coolingDown = function() {
  return this.now() < this.lastFireTime + TurretSprite.COOLDOWN;
};

/**
 * @param {Vec2d} vec  line down the center of the scan arc
 * @param {number} arc  number from 0 to 1 indicating
 * what fraction of the circle to cover.  1 means a full circle.
 * @param {number} scans  number of steps in the scan sweep.
 */
TurretSprite.prototype.scanSweep = function(vec, arc, scans) {
  var p = this.getPos(this.pos);
  var minTime = Infinity;
  for (var i = 0; i < scans; i++) {
    this.scanVec.set(vec);
    this.scanVec.rot(arc * (i / scans) * 2 * Math.PI +
        (2 * Math.random() - 1) * 2 * Math.PI * arc / scans);
    var rayScan = RayScan.alloc(
        p.x, p.y,
        p.x + this.scanVec.x, p.y + this.scanVec.y,
        1, 1);
    var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
    if (hitSpriteId && rayScan.time < minTime) {
      var sprite = this.world.getSprite(hitSpriteId);
      if (sprite instanceof ZombieSprite) {
        this.firePlasma(this.scanVec.scaleToLength(TurretSprite.PLASMA_SPEED));
      }
    }
    RayScan.free(rayScan);
  }
};

TurretSprite.prototype.firePlasma = function(dirVec) {
  var p = this.getPos(this.pos)
  // TODO: this.world.firePlasma(p.x, p.y, dirVec.x, dirVec.y); // x, y, dx, dy
  this.lastFireTime = this.now();
  this.painter.setLastFireTime(this.lastFireTime);
};
