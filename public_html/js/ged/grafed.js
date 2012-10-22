/**
 * Supports high-level queries and operations on a GrafModel,
 * optionally backed by an OpStor.
 *
 * It hides all GrafOp stuff from clients.
 *
 * State:
 * - Maintains a GrafModel throughout all op changes from the client and from stor events.
 * - Selection state
 * - Drag-operation state?
 *
 * Queries:
 * - Provides the GrafModel (read-only, honor system) to clients.
 * - Handles spacial queries, like "get closest thing".
 *
 * Mutations:
 * - Handles high-level operations like drag, copy/paste, link, edit field, etc,
 *   so the UI never has to worry about operations.
 * - Stages continuous-preview mutations like dragging, without flooding LocalStorage with changes.
 *
 * Notification:
 * - PubSub says when the model changed due to another tab or something.
 *
 * @param {GrafModel} model  The already-populated model.
 * @param {OpStor=} opt_opStor  Optional OpStor to write to (and subscribe to & read from)
 * @constructor
 */
function GrafEd(model, opt_opStor) {
  this.model = model;
  this.opStor = opt_opStor || null;

  // Keys form the set of selected IDs. Values are all trueish.
  this.selection = {};
}

GrafEd.createFromOpStor = function(opStor) {
  var ops = opStor.getOpsAfterIndex(-1);
  var model = new GrafModel();
  model.applyOps(ops);
  return new GrafEd(model, opStor);
};

GrafEd.JACK_DISTANCE = 20;

GrafEd.prototype.getModel = function() {
  return this.model;
};

/**
 * @param {GrafModel} clipModel
 * @param {Vec2d} offset
 * @return a map from the clipModel IDs to the level's model IDs
 */
GrafEd.prototype.pasteWithOffset = function(clipModel, offset) {
  var tempModel = new GrafModel();
  tempModel.addModel(clipModel);
  for (var partId in tempModel.parts) {
    var part = tempModel.parts[partId];
    part.x += offset.x;
    part.y += offset.y;
  }
  return this.paste(tempModel);
};

/**
 * @param {GrafModel} clipModel
 * @return a map from the clipModel IDs to the level's model IDs
 */
GrafEd.prototype.paste = function(clipModel) {
  var ops = clipModel.createOps();
  var idMap = this.model.rewriteOpIds(ops);
  this.commitOps(ops);

  this.clearSelection();
  this.selectByIds(plex.object.values(idMap), true);

  return idMap;
};

/**
 * Gets the offset of a jack in the world, based on it's type.
 * @param {boolean} isInput
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
GrafEd.prototype.getJackOffset = function(isInput, opt_outVec) {
  var retval = opt_outVec || new Vec2d();
  return retval.setXY(0, GrafEd.JACK_DISTANCE * (isInput ? -1 : 1));
};

/**
 * Gets the position of a jack in the world, based on its part's position
 * and the type of jack it is.
 * @param jackId
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
GrafEd.prototype.getJackPos = function(jackId, opt_outVec) {
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
GrafEd.prototype.selectNearest = function(pos, selected) {
  this.selectById(this.getNearestId(pos), selected);
};

GrafEd.prototype.clearSelection = function() {
  for (var id in this.selection) {
    delete this.selection[id];
  }
};

/**
 * Moves all selected parts by the offset vector value.
 * @param {Vec2d} offset
 */
GrafEd.prototype.moveSelectedParts = function(offset) {
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
  this.commitOps(ops);
};

/**
 * Creates links between all input jacks and all output jacks in the selection,
 * but not input/output jacks on the same part,
 * and not between jack pairs that are already linked to each other
 */
GrafEd.prototype.linkSelectedJacks = function() {
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
//        console.log('not linking a part to itself');
        continue;
      }
      // Make sure they're not already linked.
      if (this.model.getLinksBetweenJacks(output.id, input.id).length) {
//        console.log('not linking jacks that are already linked');
        continue;
      }
//      console.log(['linking jacks:', input.id, output.id].join(' '));
      ops.push({
        type: GrafOp.Type.ADD_LINK,
        id: this.model.newId(),
        jackId1: output.id,
        jackId2: input.id
      });
    }
  }
  this.commitOps(ops);
};

GrafEd.prototype.setDataOnSelection = function(keyVals) {
  var ops = [];
  for (var k in keyVals) {
    var v = keyVals[k];
    for (var objId in this.selection) {
      var obj = this.model.objs[objId];
      if (k in obj.data) {
        ops.push(this.opForSetDataById(objId, k, v));
      }
    }
  }
  this.commitOps(ops);
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
GrafEd.prototype.opForSetDataById = function(objId, key, val) {
  return {
    type: GrafOp.Type.SET_DATA,
    id: objId,
    key: key,
    value: val,
    oldValue: this.model.objs[objId].data[key]
  };
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist
 * @return a model ID, either a partId or a jackId
 */
GrafEd.prototype.getNearestId = function(pos, opt_maxDist) {
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
 * Selects or unselects a part or jack by ID.
 * @param partOrJackId
 * @param {boolean} selected true if selecting or false if unselecting
 */
GrafEd.prototype.selectById = function(partOrJackId, selected) {
  if (selected) {
    this.selection[partOrJackId] = true;
  } else {
    delete this.selection[partOrJackId];
  }
};

/**
 * Selects or unselects an array of parts or jacks by ID.
 * @param partOrJackIds
 * @param {boolean} selected true if selecting or false if unselecting
 */
GrafEd.prototype.selectByIds = function(partOrJackIds, selected) {
  for (var i = 0; i < partOrJackIds.length; i++) {
    this.selectById(partOrJackIds[i], selected);
  }
};

GrafEd.prototype.commitOps = function(ops) {
  if (this.opStor) {
    for (var i = 0; i < ops.length; i++) {
      this.opStor.appendOp(i, ops[i]);
    }
  }
  this.model.applyOps(ops);
};