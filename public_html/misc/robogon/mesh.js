/**
 * @constructor
 */
function Mesh(center, radius) {
  this.center = center;
  this.radius = radius;
  this.points = [];
  
  /**
   * Keys are 
   * Objects with fields:
   * - length
   * - pointA
   * - pointB
   * - leftTri
   * - rightTri
   */
  this.edges = {};
}

Mesh.prototype.addPoint = function(p) {
  var newPointIndex = this.points.length;
  for (var i = 0; i < this.points.length; i++) {
    var length = this.points[i].distance(p);
    this.edges[this.getEdgeName(i, newPointIndex)];
  }
  this.points.push(p);
};

Mesh.prototype.getTris = function() {
  if (points.length < 4) {
    return [];
  }
  this.calculateDistances();
  this.addFirstTri();
};

Mesh.prototype.calculateDistances = function() {
  var pointCount = this.points.length;
  var shortestLength = Infinity;
  this.shortestEdge = null;
  for (var i = 0; i < pointCount; i++) {
    var pointA = this.points[i];
    for (var j = i + 1; j < pointCount; j++) {
      var length = pointA.distance(pointB);
      var name = this.getEdgeName(i, j);
      var edge = {
          name: name,
          length: length,
          pointAIndex: i,
          pointBIndex: j
        };
      if (length < shortestLength) {
        shortestLength = length;
        this.shortestEdge = edge;
      }
      this.edges[name] = edge; 
    }
  }
};

Mesh.prototype.addFirstTri = function() {
  this.findSmallestTri(
      this.shortestEdge.pointAIndex,
      this.shortestEdge.pointBIndex);
};

Mesh.prototype.findSmallestTri = function(pointAIndex, pointBIndex) {
  var pointA = this.points[pointIndexA];
  var pointB = this.points[pointBIndex];
  var edgeAB = this.getEdge(pointIndexA, pointBIndex);
  var pointCIndex = -1;
  var shortestPerimeter = Infinity;
  var lengthAB = edgeAB.length;
  for (var i = 0; i < this.points.length; i++) {
    var pointC = this.points[i];
    var perimeter = lengthAB +
        this.getEdge(pointAIndex, i).length +
        this.getEdge(pointBIndex, i).length;
    if (perimeter < shortestPerimeter) {
      shortestPerimeter = perimeter;
      pointCIndex = i;
    }
  }
};

Mesh.prototype.isPointLeftOfEdge = function(point, edge) {
  if (!edge.leftVec) {
    var vec = (new Vec3d()).set(this.points[edge.pointAIndex]);
    vec.
    var ac = this.points[edge.pointAIndex]
  }
};

Mesh.prototype.getEdge = function(pointAIndex, pointBIndex) {
  return this.edges[this.getEdgeName(pointAIndex, pointBIndex)];
};

Mesh.prototype.getEdgeName = function(pointIndexA, pointIndexA) {
  if (pointIndexA > pointIndexB) {
    var tmp = pointIndexA;
    pointIndexA = pointIndexB;
    pointIndexB = tmp;
  }
  return pointIndexA + '_' + pointIndexB;
};