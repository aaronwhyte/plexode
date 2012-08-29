/**
 * Methods for manipulating a graf,
 * using spacial terms like position and selection.
 * @param {GrafModel} model
 * @constructor
 */
function LevelEd(model) {
  this.model = model;

  // Keys form the set of selected IDs. Values are all trueish.
  this.selection = {};

  // TODO: This will need an opstor, too, and staged ops - the works.
}

LevelEd.JACK_DISTANCE = 50;

LevelEd.prototype.getModel = function() {
  return this.model;
};

/**
 * @param {GrafModel} clipModel
 * @param {Vec2d} offset
 * @return a map from the clipModel IDs to the level's model IDs
 */
LevelEd.prototype.pasteWithOffset = function(clipModel, offset) {
  var tempModel = new GrafModel();
  tempModel.addModel(clipModel);
  for (var partId in tempModel.parts) {
    var part = tempModel.parts[partId];
    part.x += offset.x;
    part.y += offset.y;
  }
  var ops = tempModel.createOps();
  var idMap = this.model.rewriteOpIds(ops);
  this.model.applyOps(ops);
  return idMap;
};

/**
 * Gets the offset of a jack in the world, based on it's type.
 * @param {boolean} isInput
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
LevelEd.prototype.getJackOffset = function(isInput, opt_outVec) {
  var retval = opt_outVec || new Vec2d();
  return retval.setXY(0, LevelEd.JACK_DISTANCE * (isInput ? -1 : 1));
};

/**
 * Gets the position of a jack in the world, based on its part's position
 * and the type of jack it is.
 * @param jackId
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
LevelEd.prototype.getJackPos = function(jackId, opt_outVec) {
  // TODO: Link location, for deletion?
  var retval = opt_outVec || new Vec2d();
  var jack = this.model.getJack(jackId);
  var part = this.model.getPart(jack.partId);
  this.getJackOffset(jack.isInput(), retval);
  retval.addXY(part.x, part.y);
  return retval;
};

/**
 * Selects or unselects the closest part or jack.
 * @param {Vec2d} pos
 * @param {boolean} selected true if selecting or false if unselecting
 */
LevelEd.prototype.selectNearest = function(pos, selected) {
  this.selectById(this.getNearestId(pos), selected);
};

LevelEd.prototype.clearSelection = function() {
  for (var id in this.selection) {
    delete this.selection[id];
  }
};

/**
 * Moves all selected parts by the offset vector value.
 * @param {Vec2d} offset
 */
LevelEd.prototype.moveSelectedParts = function(offset) {
  var ops = [];
  for (var id in this.selection) {
    var part = this.model.getPart(id);
    if (!part) continue; // may be a jack
    ops.push({
      type: GrafOp.Type.MOVE_PART,
      id: id,
      x: part.x + offset.x,
      y: part.y + offset.y,
      oldX: part.x,
      oldY: part.y
    });
  }
  this.model.applyOps(ops);
};

/**
 * Creates links between all input jacks and all output jacks in the selection,
 * but not input/output jacks on the same part,
 * and not between jack pairs that are already linked to each other
 */
LevelEd.prototype.linkSelectedJacks = function() {
  var inputs = [];
  var outputs = [];
  for (var id in this.selection) {
    var jack = this.model.getJack(id);
    if (!jack) continue; // may be a part
    if (jack.isInput()) {
      inputs.push(jack);
    } else {
      outputs.push(jack);
    }
  }
  var ops = [];
  for (var inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
    var input = inputs[inputIndex];
    for (var outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
      var output = outputs[outputIndex];
      if (output.partId == input.partId) {
        // Don't link a part to itself.
        console.log('not linking a part to itself');
        continue;
      }
      // Make sure they're not already linked.
      if (this.model.getLinksBetweenJacks(output.id, input.id).length) {
        console.log('not linking jacks that are already linked');
        continue;
      }
      console.log(['linking jacks:', input.id, output.id].join(' '));
      ops.push({
        type: GrafOp.Type.ADD_LINK,
        id: this.model.newId(),
        jackId1: output.id,
        jackId2: input.id
      });
    }
  }
  this.model.applyOps(ops);
};


////////////////////////////////////////////////////////////////////////
// Below are the internal methods that UIs shouldn't have to use.
// They're still used by the more programatic LevelProg, though.
////////////////////////////////////////////////////////////////////////

/**
 * @param {string} objId The object whose data is to be set
 * @param {string} key The data key to set
 * @param {string} val The data value to set
 */
LevelEd.prototype.setDataById = function(objId, key, val) {
  this.model.applyOp({
    type: GrafOp.Type.SET_DATA,
    id: objId,
    key: key,
    value: val,
    oldValue: this.model.objs[objId].data[key]
  });
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist
 * @return a model ID, either a partId or a jackId
 */
LevelEd.prototype.getNearestId = function(pos, opt_maxDist) {
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

/**
 * Selects or unselects a part or jack.
 * @param partOrJackId
 * @param {boolean} selected true if selecting or false if unselecting
 */
LevelEd.prototype.selectById = function(partOrJackId, selected) {
  if (selected) {
    this.selection[partOrJackId] = true;
  } else {
    delete this.selection[partOrJackId];
  }
};
