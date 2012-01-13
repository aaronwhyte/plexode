/**
 * Populates a Vorp using a VedModel
 * @constructor
 */
function Transformer(vorp) {
  this.vorp = vorp;
}

/**
 * @param {GrafModel} model  stuff to add to Vorp
 */
Transformer.prototype.transformModel = function(model) {
  var id, cluster;
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.type == VedType.WALL) {
      this.transformWall(model.clusters[id]);
    }
  }
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.type != VedType.WALL) {
      this.transformCluster(model.clusters[id]);
    }
  }
  for (id in model.links) {
    this.transformLink(model.links[id]);
  }
};

/**
 * @param {GrafCluster} cluster
 */
Transformer.prototype.transformWall = function(cluster) {
  var parts = [];
  for (var id in cluster.parts) {
    parts.push(cluster.parts[id]);
  }
  if (parts.length != 2) {
    throw Error("Expected 2 parts in a wall cluster, found " + parts.length +
        ", in cluster with id " + cluster.id);
  }
  this.vorp.addPrefab(
      new WallPrefab(parts[0].x, parts[0].y, parts[1].x, parts[1].y));
};

/**
 * @param {GrafCluster} cluster
 */
Transformer.prototype.transformCluster = function(cluster) {
};

/**
 * @param {GrafLink} link
 */
Transformer.prototype.transformLink = function(link) {
};
