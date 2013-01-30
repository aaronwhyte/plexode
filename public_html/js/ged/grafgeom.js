/**
 * Helps things agree where GrafModel stuff is and what it's shaped like.
 * @param {GrafModel} model
 * @constructor
 */
function GrafGeom(model) {
  this.model = model;
}

GrafGeom.PART_RADIUS = 30;
GrafGeom.JACK_RADIUS = 10;
GrafGeom.JACK_DISTANCE = GrafGeom.PART_RADIUS + GrafGeom.JACK_RADIUS;
GrafGeom.SELECTION_PADDING = 2;
GrafGeom.EDIT_RADIUS = 8;

/**
 * Sets the model contents, keeping the model reference.
 * @param {GrafModel} model
 */
GrafGeom.prototype.setModelContents = function(model) {
  this.model.clear();
  this.model.addModel(model);
};

/**
 * @return {GrafModel} reference to internal model
 */
GrafGeom.prototype.getModel = function() {
  return this.model;
};

/**
 * Gets the offset of a jack in the world, based on its type.
 * @param {boolean} isInput
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
GrafGeom.prototype.getJackOffset = function(isInput, opt_outVec) {
  var retval = opt_outVec || new Vec2d();
  return retval.setXY(0, GrafGeom.JACK_DISTANCE * (isInput ? -1 : 1));
};

/**
 * Gets the position of a jack in the world, based on its part's position
 * and the type of jack it is.
 * @param jackId
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
GrafGeom.prototype.getJackPos = function(jackId, opt_outVec) {
  // TODO: Link location, for deletion?
  var retval = opt_outVec || new Vec2d();
  var jack = this.model.getJack(jackId);
  var part = this.model.getPart(jack.partId);
  this.getJackOffset(jack.isInput(), retval);
  retval.addXY(part.x, part.y);
  return retval;
};

GrafGeom.prototype.getEditButtonPos = function(partId, opt_outVec) {
  var retval = opt_outVec || new Vec2d();
  var part = this.model.getPart(partId);
  var offset = Math.SQRT1_2 * (GrafGeom.PART_RADIUS + GrafGeom.EDIT_RADIUS);
  retval.setXY(part.x + offset, part.y + offset);
  return retval;
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist
 * @return {Vec2d} the position of the object closest to "pos", or null
 */
GrafGeom.prototype.getNearestPos = function(pos, opt_maxDist) {
  var id = this.getNearestId(pos, opt_maxDist);
  if (!id) return null;
  var jack = this.model.getJack(id);
  if (jack) {
    return this.getJackPos(id);
  }
  var part = this.model.getPart(id);
  return new Vec2d(part.x, part.y);
};

/**
 * @return {Array} of IDs. If there aren't any, returns empty array.
 */
GrafGeom.prototype.getIdsInRect = function(x0, y0, x1, y1) {
  var jackPos = Vec2d.alloc();
  var idSet = new plex.StringSet();
  for (var partId in this.model.parts) {
    var part = this.model.getPart(partId);
    var dist = aabb.rectCircleDist(x0, y0, x1, y1, part.x, part.y);
    if (dist < GrafGeom.PART_RADIUS + GrafGeom.SELECTION_PADDING) {
      idSet.put(partId);
    }
    for (var jackId in part.jacks) {
      this.getJackPos(jackId, jackPos);
      var dist = aabb.rectCircleDist(x0, y0, x1, y1, jackPos.x, jackPos.y);
      if (dist < GrafGeom.JACK_RADIUS + GrafGeom.SELECTION_PADDING) {
        idSet.put(jackId);
      }
    }
  }
  Vec2d.free(jackPos);
  return idSet.getValues();
};

/**
 * @return one ID, or null.
 */
GrafGeom.prototype.getIdAtVec = function(vec) {
  var jackPos = Vec2d.alloc();
  var lowestDistSq = Infinity;
  var retId = null;
  var maxPartDist = GrafGeom.PART_RADIUS + GrafGeom.SELECTION_PADDING;
  var maxPartDistSq = maxPartDist * maxPartDist;
  var maxJackDist = GrafGeom.JACK_RADIUS + GrafGeom.SELECTION_PADDING;
  var maxJackDistSq = maxJackDist * maxJackDist;
  for (var partId in this.model.parts) {
    var part = this.model.getPart(partId);
    var distSq = Vec2d.distanceSq(vec.x, vec.y, part.x, part.y);
    if (distSq < maxPartDistSq && distSq < lowestDistSq) {
      retId = partId;
      lowestDistSq = distSq;
    }
    for (var jackId in part.jacks) {
      this.getJackPos(jackId, jackPos);
      var distSq = Vec2d.distanceSq(vec.x, vec.y, jackPos.x, jackPos.y);
      if (distSq < maxJackDistSq && distSq < lowestDistSq) {
        retId = jackId;
        lowestDistSq = distSq;
      }
    }
  }
  Vec2d.free(jackPos);
  return retId;
};

/**
 * @return {Array} of IDs. If there aren't any, returns empty array.
 */
GrafGeom.prototype.getIdsAtXY = function(x, y) {
  return this.getIdsInRect(x, y, x, y);
};

/**
 * @return {Array} of IDs. If there aren't any, returns empty array.
 */
GrafGeom.prototype.getIdsAtVec = function(v) {
  return this.getIdsInRect(v.x, v.y, v.x, v.y);
};

/**
 * @return {Vec2d?}
 */
GrafGeom.prototype.getPosById = function(id) {
  var part = this.model.getPart(id);
  if (part) {
    return new Vec2d(part.x, part.y);
  }
  var jack = this.model.getJack(id);
  if (jack) {
    return this.getJackPos(id);
  }
  return null;
};

/**
 * @return {number?}
 */
GrafGeom.prototype.getRadById = function(id) {
  var part = this.model.getPart(id);
  if (part) {
    return GrafGeom.PART_RADIUS;
  }
  var jack = this.model.getJack(id);
  if (jack) {
    return GrafGeom.JACK_RADIUS;
  }
  return null;
};

/**
 * @param {Vec2d} pos
 * @return a part ID, or null if nothing is close enough
 */
GrafGeom.prototype.getNearestEditButtonPartId = function(pos) {
  var editPos = Vec2d.alloc();

  var maxDist = GrafGeom.EDIT_RADIUS + GrafGeom.SELECTION_PADDING;
  var leastDistSq = maxDist * maxDist;
  var retId = null;

  for (var partId in this.model.parts) {
    this.getEditButtonPos(partId, editPos);
    var distSq = pos.distanceSquared(editPos);
    if (distSq < leastDistSq) {
      retId = partId;
      leastDistSq = distSq;
    }
  }
  Vec2d.free(editPos);
  return retId;
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist
 * @return a model ID, either a partId or a jackId, or null if nothing is close enough
 */
GrafGeom.prototype.getNearestId = function(pos, opt_maxDist) {
  var obj = this.getNearestPartOrJack(pos, opt_maxDist);
  return obj ? obj.id : null;
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist
 * @return {GrafJack | GrafPart | null}
 */
GrafGeom.prototype.getNearestPartOrJack = function(pos, opt_maxDist) {
  var part = this.getNearestPart(pos, opt_maxDist);
  var jack = this.getNearestJack(pos, opt_maxDist);
  if (part && jack) {
    var partDistSq = Vec2d.distanceSq(pos.x, pos.y, part.x, part.y);
    var jackDistSq = Vec2d.distanceSq(pos.x, pos.y, jack.x, jack.y);
    return jackDistSq < partDistSq ? jack : part;
  }
  return part || jack;
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist defaults to jack radius + padding
 * @return {GrafJack?} a jack, or null
 */
GrafGeom.prototype.getNearestJack = function(pos, opt_maxDist) {
  var jackPos = Vec2d.alloc();

  var maxDist = opt_maxDist || (GrafGeom.JACK_RADIUS + GrafGeom.SELECTION_PADDING);
  var leastDistSq = maxDist * maxDist;
  var retId = null;

  for (var jackId in this.model.jacks) {
    this.getJackPos(jackId, jackPos);
    var distSq = pos.distanceSquared(jackPos);
    if (distSq < leastDistSq) {
      retId = jackId;
      leastDistSq = distSq;
    }
  }
  Vec2d.free(jackPos);
  return this.model.getJack(retId);
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist defaults to defaults to part radius + padding
 * @return {GrafPart?} a part, or null
 */
GrafGeom.prototype.getNearestPart = function(pos, opt_maxDist) {
  var partPos = Vec2d.alloc();

  var maxDist = opt_maxDist || 1;
  var leastDistSq = maxDist * maxDist;
  var retId = null;

  for (var partId in this.model.parts) {
    var part = this.model.getPart(partId);
    partPos.setXY(part.x, part.y);
    var distSq = pos.distanceSquared(partPos);
    if (distSq < leastDistSq) {
      retId = partId;
      leastDistSq = distSq;
    }
  }
  Vec2d.free(partPos);
  return this.model.getPart(retId);
};

/**
 * @return object representing rectangle {x0:.., y0:.., x1:.., y1:..}
 * that encloses all parts and jacks, or null if there are no objects.
 */
GrafGeom.prototype.getBoundingRect = function() {
  var bounds = null;

  function updateBounds(x, y, rad) {
    if (!bounds) {
      bounds = {x0: x, y0: y, x1: x, y1: y};
    }
    if (x - rad < bounds.x0) bounds.x0 = x - rad;
    if (y - rad < bounds.y0) bounds.y0 = y - rad;
    if (x + rad > bounds.x1) bounds.x1 = x + rad;
    if (y + rad > bounds.y1) bounds.y1 = y + rad;
  }

  for (var partId in this.model.parts) {
    var part = this.model.getPart(partId);
    // Incorporate the jack radius into every part,
    // so the clip menu parts will all be on the same center lines.
    updateBounds(part.x, part.y, GrafGeom.PART_RADIUS + 2 * GrafGeom.JACK_RADIUS);
  }
  return bounds;
};

GrafGeom.prototype.getCenter = function() {
  var brect = this.getBoundingRect();
  var cx = (brect.x0 + brect.x1) / 2;
  var cy = (brect.y0 + brect.y1) / 2;
  return new Vec2d(cx, cy);
};