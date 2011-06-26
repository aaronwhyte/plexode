/**
 * @constructor
 */
function Robogon(count) {
  this.robos = [];
  for (var i = 0; i < count; i++) {
    this.robos[i] = new Robo();
  }
  this.workVec = new Vec3d(0, 0, 0);
  this.hull = new Hull();
  this.now = 1;
}

Robogon.prototype.clock = function() {
  this.now++;
  // calc smallest dist
  var len = this.robos.length;
  for (var i = 0; i < len; i++) {
    var r0 = this.robos[i];
    for (var j = i + 1; j < len; j++) {
      var r1 = this.robos[j];
      var ds = r0.pos.distanceSquared(r1.pos);
      r0.maybeUpdateClosestRobo(r1, ds);
    }
  }
  // calc accels
  var factor = 1;//Math.sin(this.now/60) + 0.7;
  for (var i = 0; i < len; i++) {
    var r = this.robos[i];
    // from origin
    var mag = r.pos.magnitude();
    var v = this.workVec.set(r.pos).scale(1/(mag ? mag : 1));
    r.accelerate(v.scale((1 - mag) * 0.01 * factor));
    // from nearest robo
    v.set(r.pos).subtract(r.closestRobo.pos).scaleToLength(0.0012 * factor);
    r.accelerate(v);
    // a bit of spin
    r.accelerate(v.setXYZ(r.pos.z * 0.0005, 0, 0));
  }
  // clock
  for (var i = 0; i < len; i++) {
    this.robos[i].clock();
    this.robos[i].vel.scale(0.96); // friction
  }
};

Robogon.prototype.draw = function(c, w, h) {
  // draw
  c.fillStyle = 'rgba(255, 255, 255, 0.05)';
  c.fillRect(0, 0, w, h);
//  c.clearRect(0, 0, w, h);
  c.lineCap = 'round';
  c.save();
  c.translate(w/2, h/2);
  c.scale(h/3, h/3);
  // new code
  //this.hull.clear();
  //for (var i = 0; i < this.robos.length; i++) {
    //this.hull.addPoint(this.robos[i].pos);

    for (var r = 0; r < this.robos.length; r++) {
      this.robos[r].draw(c);
    }

  //}
//  var tris = this.hull.tris;
//  c.lineWidth = 0.005;
//  c.strokeStyle = "#f00";
//  for (var j = 0; j < tris.length; j++) {
//    var tri = tris[j];
//    var p = tri.p;
//
//    c.beginPath();
//    var w = this.hull.setToTriCenter(tri, this.workVec);
//    c.moveTo(w.x, w.y);
//    w = this.hull.avg;
//    c.lineTo(w.x, w.y);
//    c.stroke();
//    
//    for (var e = 0; e < 3; e++) {
//      c.beginPath();
//      c.moveTo(p[e].x, p[e].y);
//      var e2 = (e + 1) % 3;
//      c.lineTo(p[e2].x, p[e2].y);
//      c.stroke();
//    }
//  }
  c.restore();
};
