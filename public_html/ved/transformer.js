/**
 * Creates a Vorp from a VedModel
 * @param {Vorp} vorp  The model
 * @constructor
 */
function Transformer(vorp) {
  this.vorp = vorp;
}

/**
 * @param {GrafModel} model  The thing to make a Vorp out of.
 */
Transformer.prototype.transformModel = function(model) {
  var id;
  for (id in model.clusters) {
    var cluster = model.clusters[id];
    if (cluster.type == VedType.WALL) {
      this.transformWall(model.clusters[id]);
    }
  }
//  for (id in model.clusters) {
//    var cluster = model.clusters[id];
//    if (cluster.type != VedType.WALL) {
//      this.transformNonWall(model.clusters[id]);
//    }
//  }
//  for (id in model.links) {
//    this.transformLink(model.links[id]);
//  }
};

/**
 * @param {GrafCluster} cluster
 */
Transformer.prototype.transformWall = function(cluster) {
  var parts = [];
  for (id in cluster.parts) {
    parts.push(cluster.parts[id]);
  }
  if (parts.length != 2) {
    throw Error("Expected 2 parts in a wall cluster, got " + parts.length +
        " in cluster with id " + cluster.id);
  }
  var x0 = parts[0].x;
  var y0 = parts[0].y;
  var x1 = parts[1].x;
  var y1 = parts[1].y;

  var cx = (x0 + x1) / 2;
  var cy = (y0 + y1) / 2;
  var rx = Math.abs(x0 - x1) / 2;
  var ry = Math.abs(y0 - y1) / 2;
  if (rx > ry) {
    ry = 0;
  } else {
    rx = 0;
  }
  
};
