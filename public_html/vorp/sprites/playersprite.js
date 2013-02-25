/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);

  this.pos = new Vec2d();

  this.scanVec = new Vec2d();
  this.scanInitVec = new Vec2d();
  
  this.heldPos = new Vec2d();
  this.keysVec = new Vec2d();

  this.grip = PlayerSprite.Grip.NONE;
  this.heldSprite = null;
  this.stiffPose = new Vec2d();
  this.kickPow = 0;
  this.canGrip = true;
  this.accel = PlayerSprite.MIN_ACCEL;
}
PlayerSprite.prototype = new Sprite(null);
PlayerSprite.prototype.constructor = PlayerSprite;

/**
 * @enum {number}
 */
PlayerSprite.Grip = {
  NONE: 1,
  STIFF: 2,
  LOOSE: 3
};

PlayerSprite.GRIP_RANGE = 140;
PlayerSprite.GRIP_SEEK_RANGE = 5 * PlayerSprite.GRIP_RANGE;
PlayerSprite.PULL = 0.024;
PlayerSprite.DAMP = 0.15;
PlayerSprite.MAX_KICK_POW = 24;
PlayerSprite.KICK_FORCE_MAGNIFIER = 1.1;
PlayerSprite.KICK_DECAY = 0.4;

PlayerSprite.MIN_ACCEL = 0.5;
PlayerSprite.MULT_ACCEL = 1.1;
PlayerSprite.MULT_DECEL = 0.8;
PlayerSprite.MAX_ACCEL = 1.4;
PlayerSprite.BRAKE = 0.0;

PlayerSprite.prototype.act = function() {
  this.painter.clearRayScans();
  this.addFriction(Vorp.FRICTION);
  GU_copyKeysVec(this.keysVec);
  if (!this.keysVec.isZero()) {
    this.accelerate(this.keysVec.scaleToLength(this.accel));
    this.accel *= PlayerSprite.MULT_ACCEL;
    this.accel = Math.min(this.accel, PlayerSprite.MAX_ACCEL);
  } else {
    //this.addFriction(PlayerSprite.BRAKE);
    this.accel *= PlayerSprite.MULT_DECEL;
    this.accel = Math.max(this.accel, PlayerSprite.MIN_ACCEL);
  }
  // gripper
  var kickDown = this.kickKeyDown();
  if (kickDown) {
    this.kick();
  }
  if (this.grip == PlayerSprite.Grip.NONE) {
    if (!this.gripKeyDown()) {
      this.canGrip = true;
    } else if (this.canGrip) {
      this.gripScan();
    }
  } else if (this.grip == PlayerSprite.Grip.LOOSE) {
    this.kickPow *= (1 - PlayerSprite.KICK_DECAY);
    if (this.gripKeyDown()) {
      this.initStiffPose();
    } else {
      this.looseForce();
    }
  } else if (this.grip == PlayerSprite.Grip.STIFF) {
    if (this.gripKeyDown()) {
      this.kickPow = Math.min(this.kickPow + 2, PlayerSprite.MAX_KICK_POW);
      this.stiffForce();
    } else {
      this.grip = PlayerSprite.Grip.LOOSE;
      this.looseForce();
    }
  }
  if (this.heldSprite) {
    this.painter.setHolderPos(this.getPos(this.pos));
    //this.painter.setHeldPosVel(this.heldSprite.getPos(this.pos), this.heldSprite.getVel(this.vel));
    this.painter.setHeldPos(this.heldSprite.getPos(this.pos));
    this.painter.setHolding(5 + this.kickPow);
  }
};

/**
 * @return {boolean}
 */
PlayerSprite.prototype.gripKeyDown = function() {
  return GU_keys[VK_Z] || GU_keys[VK_SEMICOLON];
};

/**
 * @return {boolean}
 */
PlayerSprite.prototype.kickKeyDown = function() {
  return GU_keys[VK_X] || GU_keys[VK_Q];
};

PlayerSprite.prototype.gripScan = function() {
  GU_copyKeysVec(this.keysVec);

  if (!this.keysVec.isZero()) {
    // long-range directional seek
    this.scanInitVec.set(this.keysVec).scaleToLength(PlayerSprite.GRIP_SEEK_RANGE);
    this.gripScanSweep(this.scanInitVec, 1/8, 16);
  } else {  
    // short-range circular seek
    this.scanInitVec.setXY(PlayerSprite.GRIP_RANGE, 0);
    this.gripScanSweep(this.scanInitVec, 1 , 16);
  }
};

/**
 * @param {Vec2d} vec  line down the center of the scan arc
 * @param {number} arc  number from 0 to 1 indicating
 * what fraction of the circle to cover.  1 means a full circle.
 * @param {number} scans  number of steps in the scan sweep.
 */
PlayerSprite.prototype.gripScanSweep = function(vec, arc, scans) {
  var p = this.getPos(this.pos);
  var minTime = Infinity;
  for (var i = 0; i < scans; i++) {
    this.scanVec.set(vec);
    this.scanVec.rot(arc * (i / (scans - 1) - 0.5) * 2 * Math.PI +
        (Math.random() - 0.5) * 2 * Math.PI * arc / scans);
    var rayScan = RayScan.alloc(
        p.x, p.y,
        p.x + this.scanVec.x, p.y + this.scanVec.y,
        5, 5);
    var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
    if (hitSpriteId && rayScan.time < minTime) {
      var sprite = this.world.getSprite(hitSpriteId);
      if (sprite.mass < Infinity) {
        this.heldSprite = sprite;
        this.grip = PlayerSprite.Grip.LOOSE;
        if (this.canGrip) {
          // Not any more.
          this.canGrip = false;
          //this.painter.clearRayScans();
        }
        // Pick the closest target.
        minTime = rayScan.time;
      }
    }
    this.painter.addRayScan(rayScan);
    RayScan.free(rayScan);
  }
};

PlayerSprite.prototype.calcKickPower = function() {
  return this.kickPow * PlayerSprite.KICK_FORCE_MAGNIFIER;
};

PlayerSprite.prototype.kick = function() {
  if (!this.heldSprite) return;
  var kick = this.calcKickPower();
  this.kickPow = 0;
  var heldPos = this.heldSprite.getPos(Vec2d.alloc());
  var pushVec = this.getPos(Vec2d.alloc()).subtract(heldPos).scaleToLength(kick);
  this.accelerate(pushVec);
  var massRatio = this.mass / this.heldSprite.mass;
  this.heldSprite.accelerate(pushVec.scale(-massRatio));
  this.breakGrip(kick);
  Vec2d.free(pushVec);
  Vec2d.free(heldPos);
};

PlayerSprite.prototype.looseForce = function() {
  var playerPos = this.getPos(Vec2d.alloc());
  var dPos = this.heldSprite.getPos(Vec2d.alloc()).subtract(playerPos);
  var dist = dPos.magnitude();
  if (this.maybeBreakGrip(dist)) {
    Vec2d.free(playerPos);
    Vec2d.free(dPos);
    return;
  }
  var aimUnit = Vec2d.alloc().set(dPos).scale(1 / dist);
  var pull = (PlayerSprite.GRIP_RANGE - dist) * PlayerSprite.PULL;
  var dVel = Vec2d.alloc().set(this.vel).subtract(this.heldSprite.vel);
  var damp = PlayerSprite.DAMP * dVel.dot(dPos) / dist;
  var accel = aimUnit.scale(pull + damp).scale(-1);
  if (dist > PlayerSprite.GRIP_RANGE) {
    var distFactor = (PlayerSprite.GRIP_SEEK_RANGE - dist) / PlayerSprite.GRIP_SEEK_RANGE;
    distFactor = Math.max(0.1, distFactor);
    accel.scale(distFactor);
  }
  //accel.clipToMaxLength(PlayerSprite.MAX_TRACTOR_ACCEL);
  this.accelerate(accel);
  var massRatio = this.mass / this.heldSprite.mass;
  this.heldSprite.accelerate(accel.scale(-massRatio));
  Vec2d.free(playerPos);
  Vec2d.free(dPos);
  Vec2d.free(aimUnit);
  Vec2d.free(dVel);
};


PlayerSprite.prototype.initStiffPose = function() {
  var playerPos = this.getPos(Vec2d.alloc());
  var dPos = this.heldSprite.getPos(Vec2d.alloc()).subtract(playerPos);
  this.stiffPose.set(dPos).scaleToLength(PlayerSprite.GRIP_RANGE * 0.95);
  this.grip = PlayerSprite.Grip.STIFF;
  Vec2d.free(playerPos);
  Vec2d.free(dPos);
};


PlayerSprite.prototype.stiffForce = function() {
  var heldSpritePos = this.heldSprite.getPos(Vec2d.alloc());
  var thisPos = this.getPos(Vec2d.alloc());
  var dPos = heldSpritePos.subtract(thisPos).subtract(this.stiffPose);
  var dist = dPos.magnitude();
  if (this.maybeBreakGrip(dist)) {
    Vec2d.free(heldSpritePos);
    Vec2d.free(thisPos);
    return;
  }
  var dVel = this.getVel(Vec2d.alloc()).subtract(this.heldSprite.vel);
  var accel = Vec2d.alloc().set(dVel).scale(-PlayerSprite.DAMP);
  accel.add(dPos.scale(PlayerSprite.PULL));
  if (dist > PlayerSprite.GRIP_RANGE) {
    var distFactor = (PlayerSprite.GRIP_SEEK_RANGE - dist) / PlayerSprite.GRIP_SEEK_RANGE;
    distFactor = Math.max(0.1, distFactor);
    accel.scale(distFactor);
  }
  //accel.clipToMaxLength(PlayerSprite.MAX_TRACTOR_ACCEL);
  this.accelerate(accel);
  var massRatio = this.mass / this.heldSprite.mass;
  this.heldSprite.accelerate(accel.scale(-massRatio));
  Vec2d.free(heldSpritePos);
  Vec2d.free(thisPos);
  Vec2d.free(dVel);
  Vec2d.free(accel);
};


PlayerSprite.prototype.maybeBreakGrip = function(dist) {
   // distance check
  if (dist > PlayerSprite.GRIP_SEEK_RANGE * 1.05) {
    this.breakGrip();
    return true;
  }
  // line-of-sight check
  var p = this.getPos(this.pos);
  var h = this.heldSprite.getPos(this.heldPos);
  var rayScan = RayScan.alloc(
      p.x, p.y,
      h.x, h.y,
      1, 1);
  var hitSpriteId = this.world.rayScan(rayScan, Vorp.GRIP_BLOCKER_GROUP);
  RayScan.free(rayScan);
  if (hitSpriteId) {
    this.breakGrip();
    return true;
  }
  return false;
};

/**
 * @param {number=} opt_kick
 */
PlayerSprite.prototype.breakGrip = function(opt_kick) {
  if (this.grip == PlayerSprite.Grip.NONE) return;
  this.grip = PlayerSprite.Grip.NONE;
  var holderSpritePos = this.getPos(Vec2d.alloc());
  this.painter.setHolderPos(holderSpritePos);
  Vec2d.free(holderSpritePos);
  this.heldSprite = null;
  this.kickPow = 0;
  this.painter.setReleasing(opt_kick || 0);
};

PlayerSprite.prototype.die = function() {
  this.breakGrip();
  this.painter.die();
};