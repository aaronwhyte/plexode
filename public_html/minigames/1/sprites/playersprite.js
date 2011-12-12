/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerSprite(phy, px, py) {
  var radius = 20;
  Sprite.call(this, phy,
      new RectPainter("#000"),
      px, py,
      0, 0, // vel
      radius, radius, // size
      radius * 4, // mass
      Game.PLAYER_GROUP,
      1.01);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();

  this.heldPos = new Vec2d();
  this.keysVec = new Vec2d();

  this.acceleration = new Vec2d();
}
PlayerSprite.prototype = new Sprite();
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.GRIP_RANGE = 120;

PlayerSprite.ACCEL = 2.5;
PlayerSprite.BRAKE = 0.10;

PlayerSprite.prototype.act = function() {
  // move
  var workVec = Vec2d.alloc(0, 0);
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);
  GU_copyKeysVec(this.keysVec);
  if (this.keysVec.x || this.keysVec.y) {
    workVec.add(this.keysVec.scaleToLength(PlayerSprite.ACCEL));
  } else {
    workVec.addXY(-PlayerSprite.BRAKE * this.vx, -PlayerSprite.BRAKE * this.vy);
  }
  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);

//  // gripper
//  var kickDown = this.kickKeyDown();
//  if (kickDown) {
//    this.kick();
//  }
//  if (this.grip == PlayerSprite.Grip.NONE) {
//    if (!this.gripKeyDown()) {
//      this.canGrip = true;
//    } else if (this.canGrip) {
//      this.gripScan();
//    }
//  } else if (this.grip == PlayerSprite.Grip.LOOSE) {
//    this.kickPow *= (1 - PlayerSprite.KICK_DECAY);
//    if (this.gripKeyDown()) {
//      this.initStiffPose();
//    } else {
//      this.looseForce();
//    }
//  } else if (this.grip == PlayerSprite.Grip.STIFF) {
//    if (this.gripKeyDown()) {
//      this.kickPow = Math.min(++(this.kickPow), PlayerSprite.MAX_KICK_POW);
//      this.stiffForce();
//    } else {
//      this.grip = PlayerSprite.Grip.LOOSE;
//      this.looseForce();
//    }
//  }
//  this.painter.setHolderPos(this.getPos(this.pos));
//  if (this.heldSprite) {
//    //this.painter.setHeldPosVel(this.heldSprite.getPos(this.pos), this.heldSprite.getVel(this.vel));
//    this.painter.setHeldPos(this.heldSprite.getPos(this.pos));
//    this.painter.setHolding(5 + this.kickPow);
//  }
};


//PlayerSprite.prototype.looseForce = function() {
//  var dx = this.px - this.heldSprite.px;
//  var dy = this.py - this.heldSprite.py;
//  var dist = Math.sqrt(dx * dx + dy * dy);
//  if (this.maybeBreakGrip(dist)) return;
//
//  var aimUnit = Vec2d.alloc(dx / dist, dy / dist);
//  var pull = (dist - PlayerSprite.GRIP_RANGE) * 0.15;
//  //pull = Math.min(pull, 3);
//  //pull = Math.max(pull, -3);
//  var dVel = Vec2d.alloc(this.vx - this.heldSprite.vx, this.vy - this.heldSprite.vy);
//  var dPos = Vec2d.alloc(dx, dy);
//  var dot = dVel.dot(dPos);
//  var damp = dot * 0.003;
//  var dvx = aimUnit.x * (pull + damp);
//  var dvy = aimUnit.y * (pull + damp);
//  var MAX = 5;
//  dvx = Math.min(MAX, Math.max(-MAX, dvx * this.heldSprite.mass));
//  dvy = Math.min(MAX, Math.max(-MAX, dvy * this.heldSprite.mass));
//  this.accelerateXY(-dvx, -dvy);
//  var massRatio = this.mass / this.heldSprite.mass;
//  this.heldSprite.accelerateXY(dvx * massRatio, dvy * massRatio);
//  Vec2d.free(aimUnit);
//  Vec2d.free(dVel);
//  Vec2d.free(dPos);
//};
//
//
//PlayerSprite.prototype.initStiffPose = function() {
//  var dx = this.heldSprite.px - this.px;
//  var dy = this.heldSprite.py - this.py;
//  var dist = Math.sqrt(dx * dx + dy * dy);
//  this.stiffPose.setXY(
//      PlayerSprite.GRIP_RANGE * dx / dist,
//      PlayerSprite.GRIP_RANGE * dy / dist);
//  this.grip = PlayerSprite.Grip.STIFF;
//  //console.log('stiffPose: ' + this.stiffPose)
//};
//
//
//PlayerSprite.prototype.stiffForce = function() {
//  var dx = this.heldSprite.px - (this.px + this.stiffPose.x);
//  var dy = this.heldSprite.py - (this.py + this.stiffPose.y);
//  var dist = Math.sqrt(dx * dx + dy * dy);
//  if (this.maybeBreakGrip(dist)) return;
//
//  var dVel = Vec2d.alloc(this.vx - this.heldSprite.vx, this.vy - this.heldSprite.vy);
//  var DAMP = 0.3;
//  var PULL = 0.07;
//  var dvx = DAMP * dVel.x - PULL * dx;
//  var dvy = DAMP * dVel.y - PULL * dy;
//  var MAX = 5;
//  dvx = Math.min(MAX, Math.max(-MAX, dvx * this.heldSprite.mass));
//  dvy = Math.min(MAX, Math.max(-MAX, dvy * this.heldSprite.mass));
//  this.accelerateXY(-dvx, -dvy);
//  var massRatio = this.mass / this.heldSprite.mass;
//  this.heldSprite.accelerateXY(dvx * massRatio, dvy * massRatio);
//  Vec2d.free(dVel);
//};
