/**
 * @constructor
 * @extends {Sprite}
 */
function PortalSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.targetSprite = this;
  this.pos = new Vec2d();
  this.vec = new Vec2d();
  this.thrust = new Vec2d();
  this.hitPos = new Vec2d();
  this.targetPos = new Vec2d();
}

PortalSprite.prototype = new Sprite(null);
PortalSprite.prototype.constructor = PortalSprite;


PortalSprite.THRUST = 0.1;

PortalSprite.prototype.setTargetSprite = function(targetSprite) {
  this.targetSprite = targetSprite;
};

PortalSprite.prototype.act = function() {
  this.targetSprite.getPos(this.pos);
  this.painter.setTwinPos(this.pos);

  this.addFriction(Vorp.FRICTION);
  this.avoidObstacles();
};

PortalSprite.prototype.onSpriteHit = function(
    hitSprite, thisAcc, hitAcc, xTime, yTime, overlapping) {
  if (!this.targetSprite ||
      hitSprite == this.targetSprite ||
      hitSprite.mass == Infinity ||
      hitSprite.area() > this.area() ||
      !thisAcc || !hitAcc ||
      hitSprite.portalCount > 3) {
    return false;
  }
  hitSprite.portalCount++;

  this.getPos(this.pos);
  var targetPos = this.targetSprite.getPos(this.targetPos);
  var dPos = hitSprite.getPos(this.hitPos).subtract(this.pos);
  var dest = Vec2d.alloc().set(targetPos);
  dest.x -= xTime ? dPos.x : 0;
  dest.y -= yTime ? dPos.y : 0;
  var teleportOK = !overlapping;
  if (teleportOK) {
    var rayScan = RayScan.alloc(
        targetPos.x, targetPos.y,
        dest.x, dest.y,
        hitSprite.rad.x * 1.01, hitSprite.rad.y * 1.01);  // fudge factor
    var otherSideSpriteId = this.world.rayScan(rayScan, Vorp.PORTAL_PROBE_GROUP);
    RayScan.free(rayScan);
    if (otherSideSpriteId) {
      var otherSideSprite = this.world.getSprite(otherSideSpriteId);
      if (otherSideSprite && (
          otherSideSprite.mass == Infinity || 
          otherSideSprite == hitSprite || 
          otherSideSprite == this.targetSprite)) {
        teleportOK = false;
      }
    }
  }

  if (teleportOK) {
    hitSprite.getPos(this.hitPos);
    this.world.splashPortal(this.hitPos.x, this.hitPos.y, false);
    var dVel = this.targetSprite.getVel(Vec2d.alloc()).subtract(this.vel);
    // A little randomness, too.
    dVel.addXY(0.001 * (Math.random() - 0.5), 0.001 * (Math.random() - 0.5));
    // Break tractor grips
    // TODO: Generalize so all (significant?) spacial discontinuity breaks all grips.
    var player = this.world.getPlayerSprite();
    if (player && (player == hitSprite || player.heldSprite == hitSprite)) {
      player.breakGrip(0);
    }

    hitSprite.setPos(dest);
    this.world.splashPortal(dest.x, dest.y, true);
    hitSprite.addVel(dVel);

    Vec2d.free(dVel);
  } else {
    hitSprite.addVel(hitAcc.subtract(thisAcc));
  }
  Vec2d.free(dest);
  return true;
};

PortalSprite.prototype.avoidObstacles = function() {
  var p = this.getPos(this.pos);
  var v = this.vec.setXY(0, this.rad.x * 2.1);
  var t = this.thrust.setXY(0, 0);
  for (var i = 0; i < 4; i++) {
    v.rot90Right();
    var rayScan = RayScan.alloc(
        p.x, p.y,
        p.x + v.x, p.y + v.y,
        this.rad.x, this.rad.y);
    var spriteId = this.world.rayScan(rayScan, Vorp.PORTAL_REPEL_GROUP);
    if (spriteId) {
      t.subtract(v);
    }
    RayScan.free(rayScan);
  }
  t.scaleToLength(PortalSprite.THRUST);
  this.accelerate(t);
};
