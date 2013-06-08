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

  this.lastFireTime = TurretSprite.COOLDOWN;
}

TurretSprite.prototype = new Sprite(null);
TurretSprite.prototype.constructor = TurretSprite;

TurretSprite.SCAN_RANGE = 1500;
TurretSprite.PLASMA_SPEED = 60;
TurretSprite.SCANS = 5;
TurretSprite.COOLDOWN = 7;

// fraction of a circle
TurretSprite.FIRE_ARC = 0.5;

TurretSprite.prototype.setTargetPos = function(vec) {
  this.targetPos = (new Vec2d()).set(vec);
  this.distToTarget = vec.distance(this.getPos(this.pos));
};

TurretSprite.prototype.act = function() {
  if (!this.targetPos || this.coolingDown()) return;
  this.scanInitVec.set(this.targetPos).subtract(this.getPos(this.pos));
  this.scanSweep(this.scanInitVec, TurretSprite.FIRE_ARC, TurretSprite.SCANS);
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
    this.scanVec.rot(arc * Math.PI * (2 * Math.random() - 1));
    var rayScan = RayScan.alloc(
        p.x, p.y,
        p.x + this.scanVec.x, p.y + this.scanVec.y,
        PlasmaSprite.RADIUS, PlasmaSprite.RADIUS);
    var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
    if (hitSpriteId && rayScan.time < minTime) {
      var sprite = this.world.getSprite(hitSpriteId);
      if (sprite instanceof ZombieSprite) {
        this.firePlasma(this.scanVec.rot(0.1 * (Math.random() - 0.5)));
        break;
      }
    }
    RayScan.free(rayScan);
  }
};

TurretSprite.prototype.firePlasma = function(dirVec) {
  var p = this.getPos(this.pos);
  dirVec.scaleToLength(Transformer.BOX_RADIUS * 1.5);
  var px = p.x + dirVec.x;
  var py = p.y + dirVec.y;
  dirVec.scaleToLength(TurretSprite.PLASMA_SPEED);
  this.world.firePlasma(
      px, py,
      dirVec.x, dirVec.y);
  this.lastFireTime = this.now();
  this.painter.setLastFireTime(this.lastFireTime);
};
