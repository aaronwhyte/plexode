/**
 * @constructor
 */
function GrafModel() {
  this.objs = {};
  this.clusters = {};
  this.parts = {};
  this.jacks = {};
  this.links = {};
  this.lastId = 0;
  this.size = 0;
}

/**
 * Returns a new ID that is not currently in use.
 * Will never return the same ID twice.
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
        throw Error('Old coords ' + [part.x, part.y] +
            'do not match op\'s expected coords. ' + dumpOp());
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

/**
 * @param {GrafModel} model  something to paste into this model
 * @return a mapping from old obj IDs to new obj IDs
 */
GrafModel.prototype.addModel = function(model) {
  var ops = model.createOps();
  this.rewriteOpIds(ops);
  this.applyOps(ops);
};

/**
 * @return a JSON array of ops that can be used to create an identical model.
 * Since that re-uses this model's IDs, it can't be added to this model.
 * See "rewriteOpIds(ops)"
 */
GrafModel.prototype.createOps = function() {
  function pushDataOps(objId, data) {
    for (var key in data) {
      ops.push({
        type: GrafOp.Type.SET_DATA,
        id: objId,
        key: key,
        oldValue: undefined,
        value: data[key]
      });
    }
  }

  // buffer up all ops before applying any
  var ops = [];

  // Add clusters.
  for (var clusterId in this.clusters) {
    var cluster = this.clusters[clusterId];
    ops.push({
      type: GrafOp.Type.ADD_CLUSTER,
      id: clusterId
    });
    pushDataOps(clusterId, cluster.data);

    // Add cluster's parts.
    for (var partId in cluster.parts) {
      var part = cluster.parts[partId];
      ops.push({
        type: GrafOp.Type.ADD_PART,
        id: partId,
        clusterId: clusterId,
        x: part.x,
        y: part.y
      });
      pushDataOps(partId, part.data);

      // Add part's jacks.
      for (var jackId in part.jacks) {
        var jack = part.jacks[jackId];
        ops.push({
          type: GrafOp.Type.ADD_JACK,
          id: jackId,
          partId: partId
        });
        pushDataOps(jackId, jack.data);
      }
    }
  }

  // Add links.
  for (var linkId in this.links) {
    var link = this.links[linkId];
    ops.push({
      type: GrafOp.Type.ADD_LINK,
      id: linkId,
      jackId1: link.jackId1,
      jackId2: link.jackId2
    });
    pushDataOps(linkId, link.data);
  }
  return ops;
};

/**
 * Overwrites the op IDs to new IDs from this model's ID generator,
 * so the ops can be applied to this model.
 * @return {Object} idMap
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
