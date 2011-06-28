/**
 * @constructor
 * @extends {Sprite}
 */
function PortalSprite(phy, painter, px, py, vx, vy, rx, ry, mass) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, mass, Vorp.PORTAL_GROUP, 1.01);
  this.vorp = null;
  this.targetSprite = this;
  this.pos = new Vec2d();
  this.hitPos = new Vec2d();
  this.targetPos = new Vec2d();
}

PortalSprite.prototype = new Sprite();
PortalSprite.prototype.constructor = PortalSprite;

PortalSprite.prototype.setVorp = function(vorp) {
  this.vorp = vorp;
};

PortalSprite.prototype.setTargetSprite = function(targetSprite) {
  this.targetSprite = targetSprite;
};

PortalSprite.prototype.act = function() {
  var workVec = Vec2d.alloc(0, 0);
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);
  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);
};

PortalSprite.prototype.onSpriteHit = function(hitSprite, thisAcc, hitAcc, xTime, yTime, overlapping) {
  if (!this.targetSprite ||
      hitSprite == this.targetSprite ||
      hitSprite.mass == Infinity ||
      hitSprite.rx * hitSprite.ry > this.rx * this.ry ||
      !thisAcc || !hitAcc ||
      hitSprite.portalCount > 3) {
    return false;
  }
//  console.log(hitSprite.portalCount);
  hitSprite.portalCount++;

  this.getPos(this.pos);
  var hitPos = hitSprite.getPos(this.hitPos);
  var targetPos = this.targetSprite.getPos(this.targetPos);

  var dpx = hitPos.x - this.pos.x;
  var dpy = hitPos.y - this.pos.y;
  var dvx = hitSprite.vx - this.vx;
  var dvy = hitSprite.vy - this.vy;

  var destX = targetPos.x - (xTime ? dpx : 0);
  var destY = targetPos.y - (yTime ? dpy : 0);
  var teleportOK = !overlapping;
  if (teleportOK) {
    var rayScan = RayScan.alloc(
        targetPos.x, targetPos.y,
        destX, destY,
        hitSprite.rx * 1.01, hitSprite.ry * 1.01);  // fudge factor
    this.phy.rayScan(rayScan, Vorp.PORTAL_PROBE_GROUP);
    var sledgeId = rayScan.hitSledgeId;
    RayScan.free(rayScan);
    if (sledgeId) {
      var otherSideSprite = this.phy.getSpriteBySledgeId(sledgeId);
      if (otherSideSprite && (
          otherSideSprite.mass == Infinity || 
          otherSideSprite == hitSprite || 
          otherSideSprite == this.targetSprite)) {
        teleportOK = false;
      }
    }
  }

  if (teleportOK) {
    this.addVelXY(-0.1 * this.vx, -0.1 * this.vy);
    this.targetSprite.addVelXY(-0.1 * this.targetSprite.vx, -0.1 * this.targetSprite.vy);

//    var c = 0.1;
//    this.addVelXY(c * thisAcc.x, c * thisAcc.y);
//    this.targetSprite.addVelXY(-c * thisAcc.x, -c * thisAcc.y);
//    hitSprite.addVelXY(c * hitAcc.x, c * hitAcc.y);

    hitSprite.setPosXY(destX, destY);
    hitSprite.setVelXY(this.targetSprite.vx + dvx * 1.0, this.targetSprite.vy + dvy * 1.0);
    return true;
  } else {
//    var c = 0.1;
    //this.targetSprite.addVelXY(-c * thisAcc.x, -c * thisAcc.y);
////    this.addVelXY(-0.1 * this.vx, -0.1 * this.vy);
//    this.addVelXY(c * thisAcc.x, c * thisAcc.y);
    hitSprite.addVelXY((hitAcc.x - thisAcc.x), (hitAcc.y - thisAcc.y));
    return true;
//    return false;
  }
};