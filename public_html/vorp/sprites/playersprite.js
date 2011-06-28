/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerSprite(phy, painter, px, py, vx, vy, rx, ry, mass) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, mass, Vorp.PLAYER_GROUP, 1.01);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();

  this.scanVec = new Vec2d();
  this.scanInitVec = new Vec2d();
  
  this.heldPos = new Vec2d();
  this.keysVec = new Vec2d();

  this.acceleration = new Vec2d();
  this.grip = PlayerSprite.Grip.NONE;
  this.heldSprite = null;
  this.stiffPose = new Vec2d();
  this.kickPow = 0;
  this.canGrip = true;
}

PlayerSprite.prototype = new Sprite();
PlayerSprite.prototype.constructor = PlayerSprite;

/**
 * @enum {number}
 */
PlayerSprite.Grip = {
  NONE: 1,
  STIFF: 2,
  LOOSE: 3
};

PlayerSprite.GRIP_RANGE = 120;
PlayerSprite.MAX_KICK_POW = 23;
PlayerSprite.KICK_DECAY = 0.4;

PlayerSprite.ACCEL = 2.5;
PlayerSprite.BRAKE = 0.10;

PlayerSprite.prototype.act = function() {
  this.painter.clearRayScans();
  // move
  var workVec = Vec2d.alloc(0, 0);
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);
  //GU_copyCustomKeysVec(this.keysVec, VK_I, VK_L, VK_K, VK_J);
  GU_copyKeysVec(this.keysVec);
  if (this.keysVec.x || this.keysVec.y) {
    workVec.add(this.keysVec.scaleToLength(PlayerSprite.ACCEL));
  } else {
    workVec.addXY(-PlayerSprite.BRAKE * this.vx, -PlayerSprite.BRAKE * this.vy);
  }
  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);

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
      this.kickPow = Math.min(++(this.kickPow), PlayerSprite.MAX_KICK_POW);
      this.stiffForce();
    } else {
      this.grip = PlayerSprite.Grip.LOOSE;
      this.looseForce();
    }
  }
  //this.painter.setHolderPosVel(this.getPos(this.pos), this.getVel(this.vel));
  this.painter.setHolderPos(this.getPos(this.pos));
  if (this.heldSprite) {
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

  if (this.keysVec.x || this.keysVec.y) {
    // long-range directional seek
    this.scanInitVec.set(this.keysVec).scaleToLength(5 * PlayerSprite.GRIP_RANGE);
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
    this.phy.rayScan(rayScan, Vorp.GENERAL_GROUP);
    
    if (rayScan.hitSledgeId && rayScan.time < minTime) {
      var sprite = this.phy.getSpriteBySledgeId(rayScan.hitSledgeId);
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
  var kick = this.kickPow * 1.6;
  //kick = Math.max(0, kick - 10);
  //kick = Math.min(kick, 50);
  return kick;
};

PlayerSprite.prototype.kick = function() {
  var kick = this.calcKickPower();
  this.kickPow = 0;
  if (!this.heldSprite) return;

  var dx = this.px - this.heldSprite.px;
  var dy = this.py - this.heldSprite.py;
  var dist = Math.sqrt(dx * dx + dy * dy);
  var pushVec = Vec2d.alloc(dx / dist, dy / dist);
  pushVec.scale(kick);
  this.accelerateXY(pushVec.x, pushVec.y);
  var massRatio = this.mass / this.heldSprite.mass;
  this.heldSprite.accelerateXY(
      -pushVec.x * massRatio,
      -pushVec.y * massRatio);
  this.breakGrip(kick);
  Vec2d.free(pushVec);
};

PlayerSprite.prototype.looseForce = function() {
  var dx = this.px - this.heldSprite.px;
  var dy = this.py - this.heldSprite.py;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (this.maybeBreakGrip(dist)) return;

  var aimUnit = Vec2d.alloc(dx / dist, dy / dist);
  var pull = (dist - PlayerSprite.GRIP_RANGE) * 0.15;
  //pull = Math.min(pull, 3);
  //pull = Math.max(pull, -3);
  var dVel = Vec2d.alloc(this.vx - this.heldSprite.vx, this.vy - this.heldSprite.vy);
  var dPos = Vec2d.alloc(dx, dy);
  var dot = dVel.dot(dPos);
  var damp = dot * 0.003;
  var dvx = aimUnit.x * (pull + damp);
  var dvy = aimUnit.y * (pull + damp);
  var MAX = 5;
  dvx = Math.min(MAX, Math.max(-MAX, dvx * this.heldSprite.mass));
  dvy = Math.min(MAX, Math.max(-MAX, dvy * this.heldSprite.mass));
  this.accelerateXY(-dvx, -dvy);
  var massRatio = this.mass / this.heldSprite.mass;
  this.heldSprite.accelerateXY(dvx * massRatio, dvy * massRatio);
  Vec2d.free(aimUnit);
  Vec2d.free(dVel);
  Vec2d.free(dPos);
};


PlayerSprite.prototype.initStiffPose = function() {
  var dx = this.heldSprite.px - this.px;
  var dy = this.heldSprite.py - this.py;
  var dist = Math.sqrt(dx * dx + dy * dy);
  this.stiffPose.setXY(
      PlayerSprite.GRIP_RANGE * dx / dist,
      PlayerSprite.GRIP_RANGE * dy / dist);
  this.grip = PlayerSprite.Grip.STIFF;
  //console.log('stiffPose: ' + this.stiffPose)
};


PlayerSprite.prototype.stiffForce = function() {
  var dx = this.heldSprite.px - (this.px + this.stiffPose.x);
  var dy = this.heldSprite.py - (this.py + this.stiffPose.y);
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (this.maybeBreakGrip(dist)) return;

  var dVel = Vec2d.alloc(this.vx - this.heldSprite.vx, this.vy - this.heldSprite.vy);
  var DAMP = 0.3;
  var PULL = 0.07;
  var dvx = DAMP * dVel.x - PULL * dx;
  var dvy = DAMP * dVel.y - PULL * dy;
  var MAX = 5;
  dvx = Math.min(MAX, Math.max(-MAX, dvx * this.heldSprite.mass));
  dvy = Math.min(MAX, Math.max(-MAX, dvy * this.heldSprite.mass));
  this.accelerateXY(-dvx, -dvy);
  var massRatio = this.mass / this.heldSprite.mass;
  this.heldSprite.accelerateXY(dvx * massRatio, dvy * massRatio);
  Vec2d.free(dVel);
};


PlayerSprite.prototype.maybeBreakGrip = function(dist) {
   // distance check
  if (dist > PlayerSprite.GRIP_RANGE * 5.1) {
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
  this.phy.rayScan(rayScan, Vorp.GRIP_BLOCKER_GROUP);
  RayScan.free(rayScan);
  if (rayScan.hitSledgeId) {
    this.breakGrip();
    return true;
  }
  return false;
};

PlayerSprite.prototype.breakGrip = function(opt_kick) {
  if (this.grip == PlayerSprite.Grip.NONE) return;
  this.grip = PlayerSprite.Grip.NONE;
  this.heldSprite = null;
  this.kickPow = 0;
  this.painter.setReleasing(opt_kick || 0);
};

PlayerSprite.prototype.die = function() {
  this.breakGrip();
  this.painter.die();
};