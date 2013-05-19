/**
 * @constructor
 * @extends {Sprite}
 */
function PortalSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.targetSprite = this;
  this.pos = new Vec2d();
  this.hitPos = new Vec2d();
  this.targetPos = new Vec2d();
}

PortalSprite.prototype = new Sprite(null);
PortalSprite.prototype.constructor = PortalSprite;

PortalSprite.prototype.setTargetSprite = function(targetSprite) {
  this.targetSprite = targetSprite;
};

PortalSprite.prototype.act = function() {
  this.addFriction(Vorp.FRICTION);
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
    var dVel = this.targetSprite.getVel(Vec2d.alloc()).subtract(this.vel);
    // A little randomness, too.
    dVel.addXY(0.001 * (Math.random() - 0.5), 0.001 * (Math.random() - 0.5));
    // Break tractor grips
    // TODO: Generalize so all (significant?) spacial discontinuity breaks all grips.
    var player = this.world.getPlayerSprite();
    if (player && (player == hitSprite || player.heldSprite == hitSprite)) {
      player.breakGrip(0);
    }

//    var accel = Vec2d.alloc().set(this.vel).scale(-0.1);
//    this.addVel(accel);
//    accel.set(this.targetSprite.vel).scale(-0.1);
//    this.targetSprite.addVel(accel);
//    Vec2d.free(accel);

    hitSprite.setPos(dest);
    hitSprite.addVel(dVel);

    Vec2d.free(dVel);
  } else {
    hitSprite.addVel(hitAcc.subtract(thisAcc));
  }
  Vec2d.free(dest);
  return true;
};
