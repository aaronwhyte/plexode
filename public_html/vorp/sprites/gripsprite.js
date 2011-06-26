/**
 * @constructor
 * @extends {Sprite}
 */
function GripSprite(phy, painter, px, py, rx, ry, mass, group) {
  Sprite.call(this, phy, painter, px, py, 0, 0, rx, ry, mass, group, Infinity);
  this.targetPos = null;  // vec
  this.onChange = null;  // fn

  this.pos = new Vec2d();
  this.heldPos = new Vec2d();
  this.accel = new Vec2d();
  this.heldSprite = null;
  this.distToTarget = 0;
  
  this.scanVec = new Vec2d();
  this.scanInitVec = new Vec2d();
}

GripSprite.prototype = new Sprite();
GripSprite.prototype.constructor = GripSprite;

GripSprite.prototype.setTargetPos = function(vec) {
  this.targetPos = (new Vec2d()).set(vec);
  this.distToTarget = vec.distance(this.getPos(this.pos));
};

GripSprite.prototype.setOnChange = function(fn) {
  this.onChange = fn;
};

GripSprite.prototype.act = function() {
  this.painter.clearRayScans();
  var p = this.getPos(this.pos);
  this.painter.setHolderPos(p);
  if (!this.heldSprite) {
    for (var i = 0; !this.heldSprite && i < 2; i++) {
      this.gripScan();
    }
  } else if (this.maybeBreakGrip()) {
    // grip broken
    this.painter.setReleasing(0);
  } else {
    // keep on grippin'
    this.gripForce();
  }
};

GripSprite.prototype.gripScan = function() {
  if (!this.targetPos) return;
  this.scanInitVec.set(this.targetPos).subtract(this.getPos(this.pos)).scale(1.5);
  this.gripScanSweep(this.scanInitVec, 1/8, 1);
  if (this.heldSprite && this.onChange) {
    this.onChange(true);
  }
};

/**
 * @param {Vec2d} vec  line down the center of the scan arc
 * @param {number} arc  number from 0 to 1 indicating
 * what fraction of the circle to cover.  1 means a full circle.
 * @param {number} scans  number of steps in the scan sweep.
 */
GripSprite.prototype.gripScanSweep = function(vec, arc, scans) {
  var p = this.getPos(this.pos);
  var minTime = Infinity;
  for (var i = 0; i < scans; i++) {
    this.scanVec.set(vec);
    this.scanVec.rot(arc * (i / scans) * 2 * Math.PI +
        (Math.random() - 0.5) * 4 * Math.PI * arc / scans);
    var rayScan = RayScan.alloc(
        p.x, p.y,
        p.x + this.scanVec.x, p.y + this.scanVec.y,
        1, 1);
    this.phy.rayScan(rayScan, Vorp.GENERAL_GROUP);
    
    if (rayScan.hitSledgeId && rayScan.time < minTime) {
      var sprite = this.phy.getSpriteBySledgeId(rayScan.hitSledgeId);
      if (sprite.mass < Infinity) {
        this.heldSprite = sprite;
        this.painter.clearRayScans();
        // Pick the closest target.
        minTime = rayScan.time;
        var hitSledgeId = rayScan.hitSledgeId;
      }
    }
    if (!this.heldSprite) {
      this.painter.addRayScan(rayScan);
    }
    RayScan.free(rayScan);
  }
};

GripSprite.prototype.gripForce = function() {
  var heldPos = this.heldSprite.getPos(this.heldPos);
  this.accel.set(this.targetPos).subtract(heldPos).scale(0.031 / this.heldSprite.mass);
  this.heldSprite.accelerate(this.accel);

  this.painter.setHolding(3); // TODO what's the real strength?
  this.painter.setHeldPos(this.heldPos);
};

/**
 * @return {boolean} true iff the grip is broken
 */
GripSprite.prototype.maybeBreakGrip = function() {
  var p = this.targetPos;
  var h = this.heldSprite.getPos(this.heldPos);
  if (p.distanceSquared(h) > this.distToTarget * this.distToTarget * 2) {
    this.heldSprite = null;
    if (this.onChange) this.onChange(false);
    return true;
  }
  return false;
};
