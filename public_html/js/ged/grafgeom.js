/**
 * Helps things agree where GrafModel stuff is and what it's shaped like.
 * @param {GrafModel} model
 * @constructor
 */
function GrafGeom(model) {
  this.model = model;
}

GrafGeom.PART_RADIUS = 50;
GrafGeom.JACK_RADIUS = GrafGeom.PART_RADIUS * 0.25;
GrafGeom.JACK_DISTANCE = GrafGeom.PART_RADIUS + GrafGeom.JACK_RADIUS;
GrafGeom.SELECTION_PADDING = 0;

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
  var maxDist = opt_maxDist || 1;
  var partPos = new Vec2d();
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
  return retId;
};
