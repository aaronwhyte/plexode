/**
 * @constructor
 */
function GrafModel() {
  this.objs = {};
  this.clusters = {};
  this.parts = {};
  this.jacks = {};
  this.links = {};
  this.size = 0;

  this.lastId = 0;
}

/**
 * Returns a new ID that is not currently in use.
 * Will never return the same ID twice.
 * @return {number}
 */
GrafModel.prototype.newId = function() {
  this.lastId++;
  while (this.objs[this.lastId]) {
    this.lastId++;
  }
  return this.lastId;
};

/**
 * Mutates the model.  If an error happens, the model is left partly mutated.
 * @param ops  array of GrafOp JSON objects
 */
GrafModel.prototype.applyOps = function(ops) {
  for (var i = 0; i < ops.length; i++) {
    this.applyOp(ops[i]);
  }
};

/**
 * Mutates the model, or throws an error.
 * @param op  a GrafOp JSON object
 */
GrafModel.prototype.applyOp = function(op) {
  var cluster, part, jack, link, jack1, jack2, obj;
  function dumpOp() {
    return JSON.stringify(op);
  }
  var self = this;
  function assertOpIdFree() {
    if (self.objs[op.id]) {
      throw Error('Obj with ID already exists: ' + dumpOp());
    }
  }
  function assertObjExists(obj) {
    if (!obj) {
      throw Error('Obj does not exist: ' + dumpOp());
    }
  }
  function assertParentExists(obj) {
    if (!obj) {
      throw Error('Parent does not exist: ' + dumpOp());
    }
  }
  function assertIsEmpty(obj) {
    if (!obj.isEmpty()) {
      throw Error('Cannot apply op ' + dumpOp() +
          ' because obj to remove is not empty: ' + obj.toString());
    }
  }
  function assertRemovable(obj) {
    assertObjExists(obj);
    assertIsEmpty(obj);
  }
  if (!op) throw Error('Cannot apply falsy op: ' + op);
  switch (op.type) {
    case GrafOp.Type.ADD_CLUSTER: {
      assertOpIdFree();
      this.objs[op.id] = this.clusters[op.id] = new GrafCluster(op);
      this.size++;
      break;
    }
    case GrafOp.Type.REMOVE_CLUSTER: {
      cluster = this.getCluster(op.id);
      assertRemovable(cluster);
      delete this.clusters[op.id];
      delete this.objs[op.id];
      this.size--;
      break;
    }
    case GrafOp.Type.ADD_PART: {
      assertOpIdFree();
      cluster = this.getCluster(op.clusterId);
      assertParentExists(cluster);
      part = new GrafPart(op);
      cluster.addPart(part);
      this.objs[op.id] = this.parts[op.id] = part;
      this.size++;
      break;
    }
    case GrafOp.Type.REMOVE_PART: {
      part = this.getPart(op.id);
      assertRemovable(part);
      cluster = this.getCluster(part.clusterId);
      assertParentExists(cluster);
      cluster.removePart(part);
      delete this.parts[op.id];
      delete this.objs[op.id];
      this.size--;
      break;
    }
    case GrafOp.Type.MOVE_PART: {
      part = this.getPart(op.id);
      assertObjExists(part);
      if (part.x != op.oldX || part.y != op.oldY) {
        throw Error('Part\'s current coords ' + [part.x, part.y] +
            ' do not match op\'s oldX/Y coords. ' + dumpOp());
      }
      part.x = op.x;
      part.y = op.y;
      break;
    }
    case GrafOp.Type.ADD_JACK: {
      assertOpIdFree();
      part = this.getPart(op.partId);
      assertParentExists(part);
      jack = new GrafJack(op);
      part.addJack(jack);
      this.objs[op.id] = this.jacks[op.id] = jack;
      this.size++;
      break;
    }
    case GrafOp.Type.REMOVE_JACK: {
      jack = this.getJack(op.id);
      assertRemovable(jack);
      part = this.getPart(jack.partId);
      assertParentExists(part);
      part.removeJack(jack);
      delete this.jacks[op.id];
      delete this.objs[op.id];
      this.size--;
      break;
    }
    case GrafOp.Type.ADD_LINK: {
      assertOpIdFree();
      jack1 = this.getJack(op.jackId1);
      assertParentExists(jack1);
      jack2 = this.getJack(op.jackId2);
      assertParentExists(jack2);
      link = new GrafLink(op);
      jack1.addLink(link);
      jack2.addLink(link);
      this.objs[op.id] = this.links[op.id] = link;
      this.size++;
      break;
    }
    case GrafOp.Type.REMOVE_LINK: {
      link = this.getLink(op.id);
      assertRemovable(link);
      jack1 = this.getJack(link.jackId1);
      jack2 = this.getJack(link.jackId2);
      assertParentExists(jack1);
      assertParentExists(jack2);
      jack1.removeLink(link);
      jack2.removeLink(link);
      delete this.links[op.id];
      delete this.objs[op.id];
      this.size--;
      break;
    }
    case GrafOp.Type.SET_DATA: {
      obj = this.objs[op.id];
      assertObjExists(obj);
      if (obj.data[op.key] != op.oldValue) {
        throw Error('expected oldValue ' + op.oldValue +
            ' does not match actual value ' + obj.data[op.key]);
      }
      if (typeof op.value === 'undefined') {
        delete obj.data[op.key];
      } else {
        obj.data[op.key] = op.value;
      }
      break;
    }
    default:
      throw Error('cannot apply op: ' + expose(op));
  }
};

GrafModel.prototype.getCluster = function(id) {
  return this.clusters[id];
};

GrafModel.prototype.getPart = function(id) {
  return this.parts[id];
};

GrafModel.prototype.getJack = function(id) {
  return this.jacks[id];
};

GrafModel.prototype.getLink = function(id) {
  return this.links[id];
};

GrafModel.prototype.getObj = function(id) {
  return this.objs[id];
};

/**
 * @param {GrafModel} model  something to paste into this model
 * @return {Array.<Object>}
 */
GrafModel.prototype.opsForAddModel = function(model) {
  var ops = model.createOps();
  this.rewriteOpIds(ops);
  return ops;
};

/**
 * @param {GrafModel} model  something to paste into this model
 */
GrafModel.prototype.addModel = function(model) {
  this.applyOps(this.opsForAddModel(model));
};

GrafModel.prototype.clear = function() {
  plex.object.clear(this.objs);
  plex.object.clear(this.clusters);
  plex.object.clear(this.parts);
  plex.object.clear(this.jacks);
  plex.object.clear(this.links);
  this.size = 0;
};

GrafModel.prototype.createSetDataOps = function(objId) {
  var ops = [];
  var obj = this.objs[objId];
  for (var key in obj.data) {
    ops.push({
      type: GrafOp.Type.SET_DATA,
      id: Number(objId),
      key: key,
      oldValue: undefined,
      value: obj.data[key]
    });
  }
  return ops;
};

/**
 * @param clusterId
 * @return {Array} ops
 */
GrafModel.prototype.createClusterOps = function(clusterId) {
  var ops = [];
  var cluster = this.clusters[clusterId];
  clusterId = Number(clusterId);
  ops.push({
    type: GrafOp.Type.ADD_CLUSTER,
    id: clusterId
  });
  plex.array.extend(ops, this.createSetDataOps(clusterId));

  // Add cluster's parts.
  for (var partIdStr in cluster.parts) {
    var partId = Number(partIdStr);
    var part = cluster.parts[partId];
    ops.push({
      type: GrafOp.Type.ADD_PART,
      id: partId,
      clusterId: clusterId,
      x: part.x,
      y: part.y
    });
    plex.array.extend(ops, this.createSetDataOps(partId));

    // Add part's jacks.
    for (var jackIdStr in part.jacks) {
      var jackId = Number(jackIdStr);
      ops.push({
        type: GrafOp.Type.ADD_JACK,
        id: jackId,
        partId: partId
      });
      plex.array.extend(ops, this.createSetDataOps(jackId));
    }
  }
  return ops;
};

/**
 * @param linkId
 * @return {Array} ops
 */
GrafModel.prototype.createLinkOps = function(linkId) {
  var ops = [];
  linkId = Number(linkId);
  var link = this.links[linkId];
  ops.push({
    type: GrafOp.Type.ADD_LINK,
    id: linkId,
    jackId1: link.jackId1,
    jackId2: link.jackId2
  });
  plex.array.extend(ops, this.createSetDataOps(linkId));
  return ops;
};

/**
 * @return {Array.<Object>} a JSON array of ops that can be used to create an identical model.
 * Since that re-uses this model's IDs, it can't be added to this model.
 * See "rewriteOpIds(ops)"
 */
GrafModel.prototype.createOps = function() {
  var ops = [];
  for (var clusterId in this.clusters) {
    plex.array.extend(ops, this.createClusterOps(clusterId))
  }
  for (var linkId in this.links) {
    plex.array.extend(ops, this.createLinkOps(linkId));
  }
  return ops;
};

/**
 * Overwrites the op IDs to new IDs from this model's ID generator,
 * so the ops can be applied to this model.
 * So if this model is empty, the op IDs will be given small numbers.
 * @return {Object} idMap from old ID to new ID
 */
GrafModel.prototype.rewriteOpIds = function(ops) {
  var self = this;
  var idMap = {};

  function addId(oldId) {
    if (idMap[oldId]) {
      throw Error('the list of ops seems to have included the same ID twice: ' + oldId);
    }
    var newId = self.newId();
    idMap[oldId] = newId;
    return newId;
  }
  function getId(oldId) {
    var newId = idMap[oldId];
    if (!newId) {
      throw Error('model refers to nonexistent id: ' + oldId);
    }
    return newId;
  }

  function rewriteId(op, fieldName) {
    if (op[fieldName]) {
      op[fieldName] = getId(op[fieldName]);
    }
  }

  // These are the names of fields that reference other IDs.
  // Parts have clusterIds, jacks have partIds, and links have jackIds 1 and 2.
  var fieldNames = ['clusterId', 'partId', 'jackId1', 'jackId2'];

  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    if (GrafOp.isAddOpType(op.type)) {
      // For add ops, the id is the new object's ID.
      op.id = addId(op.id);
    } else {
      // For non-add ops, the id points to the object to be changed.
      rewriteId(op, "id");
    }
    for (var j = 0; j < fieldNames.length; j++) {
      rewriteId(op, fieldNames[j]);
    }
  }
  return idMap;
};

GrafModel.prototype.getLinksBetweenJacks = function(jackId1, jackId2) {
  var links = [];
  var jack1 = this.getJack(jackId1);
  var jack2 = this.getJack(jackId2);
  for (var linkId1 in jack1.links) {
    for (var linkId2 in jack2.links) {
      if (linkId1 == linkId2) {
        links.push(jack1.links[linkId1]);
      }
    }
  }
  return links;
};

/**
 * @param {Array} clusterIds the IDs of clusters in this model to copy.
 * @return {GrafModel} A new model containing only the clusters in clusterIds,
 * plus the links between jacks in those clusters.
 */
GrafModel.prototype.copyClusters = function(clusterIds) {
  var copy = new GrafModel();
  var handledClusters = {};
  for (var i = 0; i < clusterIds.length; i++) {
    var id = clusterIds[i];
    if (!handledClusters[id]) {
      copy.applyOps(this.createClusterOps(id));
      handledClusters[id] = true;
    }
  }
  for (var linkId in this.links) {
    var link = this.getLink(linkId);
    if (copy.jacks[link.jackId1] && copy.jacks[link.jackId2]) {
      copy.applyOps(this.createLinkOps(linkId));
    }
  }
  return copy;
};
