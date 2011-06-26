
Vec3d.pool = [];
Vec3d.poolSize = 0;

/**
 * @param {number=} x
 * @param {number=} y
 * @param {number=} z
 * @constructor
 */
function Vec3d(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};

Vec3d.prototype.reset = function(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};

Vec3d.alloc = function(x, y, z) {
  var retval;
  if (Vec3d.poolSize) {
    retval = Vec3d.pool[--Vec3d.poolSize];
    retval.reset(x, y, z);
  } else {
    retval = new Vec3d(x, y, z);
  }
  return retval;
};

Vec3d.free = function(v) {
  Vec3d.pool[Vec3d.poolSize++] = v;
};


Vec3d.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  return this;
};

Vec3d.prototype.addXYZ = function(x, y, z) {
  this.x += x;
  this.y += y;
  this.z += z;
  return this;
};

Vec3d.prototype.subtract = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  return this;
};

Vec3d.prototype.set = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  return this;
};

Vec3d.prototype.setXYZ = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

Vec3d.prototype.scale = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;
  return this;
};

Vec3d.prototype.scaleXYZ = function(sx, sy, sz) {
  this.x *= sx;
  this.y *= sy;
  this.z *= sz;
  return this;
};

Vec3d.prototype.dot = function(that) {
  return this.x * that.x + this.y * that.y + this.z * that.z;
};

Vec3d.dotXYZXYZ = function(x0, y0, z0, x1, y1, z1) {
  return x0 * x1 + y0 * y1 + z0 * z1;
};

Vec3d.prototype.cross = function(that, out) {
  if (!out) out = new Vec3d();
  out.x = this.y * that.z - this.z * that.y;
  out.y = this.z * that.x - this.x * that.z;
  out.z = this.x * that.y - this.y * that.x;
  return out;
};

Vec3d.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vec3d.prototype.distanceSquared = function(that) {
  var dx = this.x - that.x;
  var dy = this.y - that.y;
  var dz = this.z - that.z;
  return dx * dx + dy * dy + dz * dz;
};

Vec3d.prototype.distance = function(that) {
  return Math.sqrt(this.distanceSquared(that));
};

/**
 * Scales to the desired length, or 0 if the vector is {0, 0}
 */
Vec3d.prototype.scaleToLength = function(length) {
  var m = this.magnitude();
  if (m) {
    this.scale(length / m);
  }
  return this;
};

Vec3d.prototype.equals = function(v) {
  return (this.x==v.x && this.y==v.y && this.z==v.z);
};

Vec3d.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
};
