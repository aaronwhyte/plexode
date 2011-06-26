/**
 * A 3D convex Delaunay hull made of triangles derived from a list of 3D points.
 * @contructor
 */
function Hull() {
  this.points = [];
  this.tris = [];
  this.avg = new Vec3d();
  this.work1 = new Vec3d();
  this.work2 = new Vec3d();
  this.nextId = 1;
}

Hull.prototype.clear = function() {
  this.points.length = 0;
  this.tris.length = 0;
  this.avg.setXYZ(0, 0, 0);
};

/**
 * @param {Vec3d} p
 */
Hull.prototype.addPoint = function(p) {
  //debugger;
  p.id = this.nextId++;
  this.points.push(p);
  if (this.points.length == 4) {
    // enough to start a hull
    for (var i = 0; i < 4; i++) {
      this.addTri(
          this.points[i],
          this.points[(i + 1) % 4],
          this.points[(i + 2) % 4]
          );
    }
    this.avg.scale(this.points.length - 1).add(p).scale(1/this.points.length);
    return;
  }
  var edges = {}; // edges with only one tri
  for (var i = 0; i < this.tris.length;) {
  // Find tris facing the point, and delete them.
    var tri = this.tris[i];
    // Set both workvecs to the center of the tri.
    this.setToTriCenter(tri, this.work1);
    this.work2.set(this.work1);
    var avgToTri = this.work1.subtract(this.avg)
    avgToTri.scaleToLength(1);
    var pointToTri = this.work2.subtract(p).scaleToLength(1);
    pointToTri.scaleToLength(1);
    var dot = avgToTri.dot(pointToTri);
    var facing = dot < 0;
    if (facing) {
      // Delete the tri at i by copying the tail over it.
      this.tris[i] = this.tris[this.tris.length - 1];
      this.tris.length--;
      // Track which edges have exactly one tri attached to them.
      // (In a closed hull, all edges will have two tris.)
      for (var j = 0; j < 3; j++) {
        var pointA = tri.p[j];
        var pointB = tri.p[(j + 1) % 3];
        if (pointA.id > pointB.id) {
          var tmp = pointA;
          pointA = pointB;
          pointB = tmp;
        }
        var edgeCode = pointA.id + '_' + pointB.id;
        //console.log(edgeCode);
        if (edgeCode in edges) {
          delete edges[edgeCode];  // edge with no tris
          //console.log('edge w no tris');
        } else {
          edges[edgeCode] = [pointA, pointB]; // edge with one tri
          //console.log('edge w one tris');
        }
      }
    } else {
      i++;
    }
  }
  // The one-tri edges form a ring around a hole in the hull facing the point.
  // Make tris to seal the breach.
  for (var edgeCode in edges) {
    var pointPair = edges[edgeCode];
    this.addTri(p, pointPair[0], pointPair[1]);
  }
  this.avg.scale(this.points.length - 1).add(p).scale(1/this.points.length);
};

Hull.prototype.setToTriCenter = function(tri, out) {
  return out.set(tri.p[0]).add(tri.p[1]).add(tri.p[2]).scale(1/3);
};

Hull.prototype.addTri = function(p0, p1, p2) {
  var tri = {
    p: [p0, p1, p2],
    id: this.nextId++
  };
  this.tris.push(tri);
  return tri;
};
