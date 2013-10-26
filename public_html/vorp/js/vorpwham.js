/**
 * @constructor
 * @extends {Wham}
 */
function VorpWham() {
  Wham.call(this);
  this.p1 = new Vec2d();
  this.p2 = new Vec2d();
  this.p1p2 = new Vec2d();
}
VorpWham.prototype = new Wham();
VorpWham.prototype.constructor = VorpWham;

VorpWham.prototype.calcRepulsion = function(s1, s2, accOut) {
  var p1 = s1.getPos(this.p1);
  var p2 = s2.getPos(this.p2);
  var p1p2 = this.p1p2.set(p2).subtract(p1);
  var lowMass = Math.min(s1.mass, s2.mass);
  var ACC = 1;
  var f = lowMass * ACC;
  var maxRx = Math.max(s1.rad.x, s2.rad.x);
  var maxRy = Math.max(s1.rad.y, s2.rad.y);
  if (maxRx > maxRy) {
    p1p2.x = 0;
  } else if (maxRx < maxRy) {
    p1p2.y = 0;
  }
  accOut[0].set(p1p2).scaleToLength(-f / s1.mass);
  accOut[1].set(p1p2).scaleToLength(f / s2.mass);
};