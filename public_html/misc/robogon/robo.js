/**
 * @constructor
 */
function Robo() {
  function r() {
    return Math.random() - 0.5;
  }
  this.pos = new Vec3d(r(), r(), r());
  this.oldPos = new Vec3d().set(this.pos);
  this.vel = new Vec3d(0, 0, 0); 
  this.acc = new Vec3d(0, 0, 0);
  this.closestRobo = null;
  this.closestRoboDist = Infinity;
}

Robo.prototype.accelerate = function(v) {
  this.acc.add(v);
};

Robo.prototype.maybeUpdateClosestRobo = function(that, dist) {
  if (dist < this.closestRoboDist) {
    this.closestRoboDist = dist;
    this.closestRobo = that;
  }
  if (dist < that.closestRoboDist) {
    that.closestRoboDist = dist;
    that.closestRobo = this;
  }
};

Robo.prototype.clock = function() {
  this.oldPos.set(this.pos);
  this.vel.add(this.acc);
  this.acc.setXYZ(0, 0, 0);
  this.pos.add(this.vel);
  //this.closestRobo = null;
  this.closestRoboDist = Infinity;
};

Robo.prototype.draw = function(c) {
  c.beginPath();
  c.lineWidth = 0.02 * (this.pos.z + 1.1);//this.pos.z + 1;
  c.strokeStyle = "#000";
  c.moveTo(this.pos.x, this.pos.y);
  c.lineTo(this.closestRobo.pos.x, this.closestRobo.pos.y);
  c.stroke();
//  var r = 0.01;
//  c.fillRect(
//      this.pos.x - r, this.pos.y - r,
//      r*2, r*2);
};