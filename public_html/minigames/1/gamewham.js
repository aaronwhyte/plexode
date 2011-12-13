/**
 * @constructor
 * @extends {GameWham}
 */
function GameWham() {
  Wham.call(this);
  this.p1 = new Vec2d();
  this.p2 = new Vec2d();
  this.p1p2 = new Vec2d();
}
GameWham.prototype = new Wham();
GameWham.prototype.constructor = GameWham;

/**
 * Mutates sprites.
 * @param phy
 * @param spriteId1
 * @param spriteId2
 * @param xTime
 * @param yTime
 */
GameWham.prototype.spriteHit = function(phy, spriteId1, spriteId2, xTime, yTime, overlapping) {
  var s1 = phy.getSprite(spriteId1);
  var s2 = phy.getSprite(spriteId2);

  if (overlapping) {
    this.calcRepulsion(s1, s2, this.accelerationsOut);
  } else {
    this.calcAcceleration(s1, s2, xTime, yTime, 0.5, this.accelerationsOut);
  }
  if (this.isStrikeHit(s1, s2) || this.isStrikeHit(s2, s1)) {
    this.addRepulsionBoost(s1, s2, this.accelerationsOut);
  }
  var a1 = this.accelerationsOut[0];
  var a2 = this.accelerationsOut[1];
  s1.addVelXY(a1.x, a1.y);
  s2.addVelXY(a2.x, a2.y);
  s1.onSpriteHit(s2);
  s2.onSpriteHit(s1);
};

GameWham.prototype.addRepulsionBoost = function(s1, s2, vecsOut) {
  var f = Vec2d.alloc(s1.px, s1.py);
  f.addXY(-s2.px, -s2.py);
  f.scaleToLength(20000);
  vecsOut[0].addXY(f.x / s1.mass, f.y / s1.mass);
  vecsOut[1].addXY(-f.x / s2.mass, -f.y / s2.mass);
  Vec2d.free(f);
};

GameWham.prototype.isStrikeHit = function(s1, s2) {
  return s1 instanceof FlailSprite &&
      (s2 instanceof EnemySprite);
};

GameWham.prototype.calcRepulsion = function(s1, s2, accOut) {
  var p1 = s1.getPos(this.p1);
  var p2 = s2.getPos(this.p2);
  var p1p2 = this.p1p2.set(p2).subtract(p1);
  var lowMass = Math.min(s1.mass, s2.mass);
  var ACC = 1;
  var f = lowMass * ACC;
  var maxRx = Math.max(s1.rx, s2.rx);
  var maxRy = Math.max(s1.ry, s2.ry);
  if (maxRx > maxRy) {
    p1p2.x = 0;
  } else if (maxRx < maxRy) {
    p1p2.y = 0;
  }
  p1p2.scaleToLength(1);
  accOut[0].set(p1p2).scale(-f / s1.mass); 
  accOut[1].set(p1p2).scale(f / s2.mass); 
};
