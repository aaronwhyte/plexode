/**
 * This is an attempt at making collision response code modular.
 * But it kinda sucks.
 * @constructor
 */
function Wham() {
  this.v1 = new Vec2d();
  this.v2 = new Vec2d();
}

///**
// * Mutates sprite velocities
// * @param game
// * @param spriteId1
// * @param spriteId2
// * @param xTime
// * @param yTime
// */
//Wham.prototype.spriteHit = function(game, spriteId1, spriteId2, xTime, yTime) {
//  var sprite1 = game.getSprite(spriteId1);
//  var sprite2 = game.getSprite(spriteId2);
//  this.calcAcceleration(sprite1, sprite2, xTime, yTime, Wham.GRIP, this.accelerationsOut);
//  var a1 = this.accelerationsOut[0];
//  var a2 = this.accelerationsOut[1];
//  sprite1.addVelXY(a1.x, a1.y);
//  sprite2.addVelXY(a2.x, a2.y);
//  sprite1.onSpriteHit(sprite2, game);
//  sprite2.onSpriteHit(sprite1, game);
//};

/**
 * Calculates acelerations without altering anything except the out vecs.
 */
Wham.prototype.calcAcceleration = function(sprite1, sprite2, xTime, yTime, grip, elasticity, out) {
  if (xTime && yTime) {
    throw 'xTime, yTime both set: ' + xTime + ', ' + yTime;
  }
  var m1 = sprite1.mass;
  var m2 = sprite2.mass;
  var v1 = sprite1.getVel(this.v1);
  var v2 = sprite2.getVel(this.v2);
  var elasticity = Math.min(
      sprite1.elasticity || elasticity,
      sprite2.elasticity || elasticity);

  // initial acceleration
  var a1 = out[0];
  var a2 = out[1];
  a1.setXY(0,0);
  a2.setXY(0,0);

  if (m1 == Infinity && m2 != Infinity) {
    if (xTime) {
      a2.x = -v2.x * (1 + elasticity);
    }
    if (yTime) {
      a2.y = -v2.y * (1 + elasticity);
    }
  } else if (m2 == Infinity && m1 != Infinity) {
    if (xTime) {
      a1.x = -v1.x * (1 + elasticity);
    }
    if (yTime) {
      a1.y = -v1.y * (1 + elasticity);
    }
  } else if (m1 && m2 && m1 != Infinity && m2 != Infinity) {

    // momentums
    var ux1 = m1 * v1.x;
    var uy1 = m1 * v1.y;
    var ux2 = m2 * v2.x;
    var uy2 = m2 * v2.y;
    var ux = ux1 + ux2;
    var uy = uy1 + uy2;

    // inelastic collision final velocity
    var vx = ux / (m1 + m2);
    var vy = uy / (m1 + m2);

    // If acceleration for inelastic collision is "a"
    // then a completely elastic collision's acceleration would be 2*a.
    // Along the other axis, acceleration is 0 to a.
    if (xTime) {
      a1.setXY((vx - v1.x) * (1 + elasticity), (vy - v1.y) * grip);
      a2.setXY((vx - v2.x) * (1 + elasticity), (vy - v2.y) * grip);
    } else {
      a1.setXY((vx - v1.x) * grip, (vy - v1.y) * (1 + elasticity));
      a2.setXY((vx - v2.x) * grip, (vy - v2.y) * (1 + elasticity));
    }
  }
};
