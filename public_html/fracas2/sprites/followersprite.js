/**
 * @constructor
 * @extends {Sprite}
 */
function FollowerSprite(phy, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, px, py, vx, vy, rx, ry, mass, group, 1.01);
  this.workVec = new Vec2d();
  this.posWorkVec = new Vec2d();
  
  this.playerScan = new Vec2d();
  this.playerThrust = new Vec2d();
  this.playerFoundTime = -1000;
  
  this.wallScan = new Vec2d();
  this.wallThrust = new Vec2d();
  this.wallFoundTime = -1000;
  
  this.acceleration = new Vec2d();
}

FollowerSprite.WALL = 1;
FollowerSprite.PLAYER = 2;

FollowerSprite.prototype = new Sprite(null, 0, 0, 0, 0, 0, 0, 0, 0, 0);
FollowerSprite.prototype.constructor = FollowerSprite;

FollowerSprite.prototype.act = function(frac) {
  var now = this.now();
  var phy = this.phy;
  var wall = false;
  var player = false;

  var pos = this.posWorkVec;
  this.getPos(pos);
  
  // init acceleration to friction
  this.getVel(this.acceleration);
  this.acceleration.scale(-Phy.FRICTION);
  
  // Scan for wall.
  this.getVel(this.workVec);
  //this.workVec.scaleToLength(2);
  //this.workVec.addXY((Math.random() - 0.5), (Math.random() - 0.5));
  var wallScanLength = this.rx * 4;
  this.workVec.scaleToLength(wallScanLength);
  var rayScan = RayScan.alloc(
      pos.x, pos.y,
      this.workVec.x + pos.x, this.workVec.y + pos.y,
      this.rx, this.ry);
  phy.rayScan(rayScan, Fracas2.ENEMY_GROUP);
  if (rayScan.hitSledgeId) {
    this.wallThrust.set(this.workVec);
    //this.wallThrust.rot90Right();
    this.wallThrust.scaleToLength(1 * (rayScan.time - 1));
    this.wallFoundTime = now;
  }
  RayScan.free(rayScan);

  // Scan for player.
  if (Math.random() < 0.1) {
    frac.getPlayerSprite().getPos(this.workVec);
    this.workVec.subtract(pos);
    this.drawScan = false;
    this.workVec.scaleToLength(500);
    var rayScan = RayScan.alloc(
        pos.x, pos.y,
        this.workVec.x + pos.x, this.workVec.y + pos.y,
        2, 2);
    phy.rayScan(rayScan, Fracas2.LOS_SENSOR_GROUP);
    if (rayScan.hitSledgeId == phy.spriteIdToSledgeId[frac.playerId]) {
      this.playerThrust.set(this.workVec);
      var chase = Math.min((rayScan.time - 0) * 0.5);
      this.playerThrust.scaleToLength(chase);
      this.playerFoundTime = now;
    }
    RayScan.free(rayScan);
  }
  // If wall sensed lately, thrust in the opposite direction.
  if (this.wallFoundTime + 1 >= now) {
    this.acceleration.add(this.wallThrust);
    wall = true;
  }
  if (this.playerFoundTime + 60 >= now) {
    // thrust at the player
    this.acceleration.add(this.playerThrust);
    player = true;
  }

  // Thrust in the direction we're already going.
  this.getVel(this.workVec);
  this.workVec.scaleToLength(0.2);
  this.acceleration.add(this.workVec);

  // Add a little randomness
  this.workVec.setXY(0.1 * (Math.random() - 0.5), 0.1 * (Math.random() - 0.5));
  this.acceleration.add(this.workVec);
  
  this.addVelXY(this.acceleration.x, this.acceleration.y);
};

FollowerSprite.prototype.draw = function(renderer) {
  if (this.playerFoundTime + 60 < this.now()) {
    renderer.setFillStyle('#080');
  } else {
    renderer.setFillStyle('#8f8');
  }
  renderer.drawSprite(this);
};

