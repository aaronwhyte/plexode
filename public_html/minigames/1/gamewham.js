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
  var a1 = this.accelerationsOut[0];
  var a2 = this.accelerationsOut[1];
  s1.addVelXY(a1.x, a1.y);
  s2.addVelXY(a2.x, a2.y);
  s1.onSpriteHit(s2);
  s2.onSpriteHit(s1);
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
