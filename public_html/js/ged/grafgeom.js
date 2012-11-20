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
GrafGeom.SELECTION_PADDING = 0;

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
 * @return {Array} of IDs. If there aren't any, returns empty array.
 */
GrafGeom.prototype.getIdsAtXY = function(x, y) {
  return this.getIdsInRect(x, y, x, y);
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
 * @param {number=} opt_maxDist
 * @return a model ID, either a partId or a jackId, or null if nothing is close enough
 */
GrafGeom.prototype.getNearestId = function(pos, opt_maxDist) {
  var jackPos = Vec2d.alloc();
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
    for (var jackId in part.jacks) {
      this.getJackPos(jackId, jackPos);
      distSq = pos.distanceSquared(jackPos);
      if (distSq < leastDistSq) {
        retId = jackId;
        leastDistSq = distSq;
      }
    }
  }
  Vec2d.free(jackPos);
  Vec2d.free(partPos);
  return retId;
};

/**
 * @return object representing rectangle {x0:.., y0:.., x1:.., y1:..}
 * that encloses all parts and jacks, or null if there are no objects.
 */
GrafGeom.prototype.getBoundingRect = function() {
  var jackPos = Vec2d.alloc();
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
    updateBounds(part.x, part.y, GrafGeom.PART_RADIUS);
    for (var jackId in part.jacks) {
      this.getJackPos(jackId, jackPos);
      updateBounds(jackPos.x, jackPos.y, GrafGeom.JACK_RADIUS);
    }
  }
  Vec2d.free(jackPos);
  return bounds;
};

GrafGeom.prototype.getCenter = function() {
  var brect = this.getBoundingRect();
  var cx = (brect.x0 + brect.x1) / 2;
  var cy = (brect.y0 + brect.y1) / 2;
  return new Vec2d(cx, cy);
};