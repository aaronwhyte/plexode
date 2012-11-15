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
  this.geom = new GrafGeom(model);
  this.opStor = opt_opStor || null;

  this.selStack = new SelStack();

  // two Vec2ds (or nulls)
  this.selectionStart = null;
  this.selectionEnd = null;

  // two Vec2ds (or nulls)
  this.dragStart = null;
  this.dragEnd = null;

  // A list of GrafOps that are reflected in the GrafModel, but not commited to the OpStor.
  // Used by continuous-preview changes, like dragging parts
  this.stagedOps = [];

  // for this to pass to OpStor
  this.opStorCallback = null;
  this.highestOpStorIndex = -1;

  // for GrafUi to set
  this.invalidationCallback = null;

  this.undoStack = [];
  this.redoStack = [];
}

GrafEd.createFromOpStor = function(opStor) {
  var grafEd = new GrafEd(new GrafModel(), opStor);
  grafEd.syncOps();
  return grafEd;
};

GrafEd.prototype.getModel = function() {
  return this.model;
};

/**
 * @param {GrafModel} clipModel
 * @param {Vec2d} offset
 * @return {Object} a map from the clipModel IDs to the level's model IDs
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
 * @return {Object} a map from the clipModel IDs to the level's model IDs
 */
GrafEd.prototype.paste = function(clipModel) {
  var ops = clipModel.createOps();
  var idMap = this.model.rewriteOpIds(ops);
  this.commitOps(ops);

  this.selectByIds(plex.object.values(idMap), true);

  return idMap;
};

/**
 * Gets the offset of a jack in the world, based on its type.
 * @param {boolean} isInput
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
GrafEd.prototype.getJackOffset = function(isInput, opt_outVec) {
  return this.geom.getJackOffset(isInput, opt_outVec);
};

/**
 * Gets the position of a jack in the world, based on its part's position
 * and the type of jack it is.
 * @param jackId
 * @param {Vec2d=} opt_outVec
 * @return {Vec2d}
 */
GrafEd.prototype.getJackPos = function(jackId, opt_outVec) {
  return this.geom.getJackPos(jackId, opt_outVec);
};

/**
 * Selects or unselects the closest part or jack.
 * @param {Vec2d} pos
 * @param {boolean} selected true if selecting or false if unselecting
 */
GrafEd.prototype.selectNearest = function(pos, selected) {
  this.selectById(this.geom.getNearestId(pos), selected);
};

GrafEd.prototype.popSelection = function() {
  return this.selStack.pop();
};

/**
 * Pops all selections off the stack.
 */
GrafEd.prototype.clearSelection = function() {
  while(this.selStack.pop());
};

GrafEd.prototype.getMoveSelectedPartsOps = function(offset) {
  var ops = [];
  var ids = this.getSelectedIds();
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var part = this.model.getPart(id);
    if (!part) continue; // may be a jack
    ops.push({
      type:GrafOp.Type.MOVE_PART,
      id:id,
      x:part.x + offset.x,
      y:part.y + offset.y,
      oldX:part.x,
      oldY:part.y
    });
  }
  return ops;
};

/**
 * Moves all selected parts by the offset vector value.
 * @param {Vec2d} offset
 */
GrafEd.prototype.moveSelectedParts = function(offset) {
  var ops = this.getMoveSelectedPartsOps(offset);
  this.commitOps(ops);
};

GrafEd.prototype.getSelectedIds = function(opt_num) {
  var num = opt_num || 0;
  var stringSet = this.selStack.peek(num);
  return stringSet ? stringSet.getValues() : [];
};

/**
 * Creates links between all input jacks and all output jacks in the selection,
 * but not input/output jacks on the same part,
 * and not between jack pairs that are already linked to each other
 */
GrafEd.prototype.linkSelectedJacks = function() {
  var inputs = [];
  var outputs = [];
  var ids = this.getSelectedIds();
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
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
  var ids = this.getSelectedIds();
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var obj = this.model.objs[id];
    for (var k in keyVals) {
      var v = keyVals[k];
      if (k in obj.data) {
        ops.push(this.opForSetDataById(id, k, v));
      }
    }
  }
  this.commitOps(ops);
};

GrafEd.prototype.startSelectionVec = function(v) {
  this.startSelectionXY(v.x, v.y);
};

GrafEd.prototype.startSelectionXY = function(x, y) {
  this.selectionStart = new Vec2d(x, y);
  this.selectionEnd = new Vec2d(x, y);
};

GrafEd.prototype.continueSelectionVec = function(v) {
  this.continueSelectionXY(v.x, v.y);
};
GrafEd.prototype.continueSelectionXY = function(x, y) {
  this.selectionEnd.setXY(x, y);
};

GrafEd.prototype.endSelection = function() {
  var ids = this.getHilitedIds();
  if (ids.length) {
    this.selStack.push((new plex.StringSet()).putArray(ids));
  }
  this.selectionStart = null;
  this.selectionEnd = null;
};

GrafEd.prototype.addSelections = function() {
  this.selStack.add();
};

GrafEd.prototype.subtractSelections = function() {
  this.selStack.subtract();
};

/**
 * @return {Array} of [x0, y0, x1, y1] or null
 */
GrafEd.prototype.getHiliteRect = function() {
  if (!this.selectionStart) return null;
  return [
    this.selectionStart.x, this.selectionStart.y,
    this.selectionEnd.x, this.selectionEnd.y];
};

/**
 * @return {Array} of IDs. If there aren't any, returns empty array.
 */
GrafEd.prototype.getHilitedIds = function() {
  if (!this.selectionStart) return [];
  return this.geom.getIdsInRect(
      this.selectionStart.x, this.selectionStart.y,
      this.selectionEnd.x, this.selectionEnd.y);
};

/**
 * @return {Array} of IDs. If there aren't any, returns empty array.
 */
GrafEd.prototype.getHoverIds = function(x, y) {
  return this.geom.getIdsInRect(x, y, x, y);
};

GrafEd.prototype.startDragVec = function(v) {
  this.startDragXY(v.x, v.y);
};

GrafEd.prototype.startDragXY = function(x, y) {
  this.dragStart = new Vec2d(x, y);
  this.dragEnd = new Vec2d(x, y);
};

GrafEd.prototype.continueDragVec = function(v) {
  this.continueDragXY(v.x, v.y);
};

GrafEd.prototype.continueDragXY = function(x, y) {
  this.dragEnd.setXY(x, y);
  this.model.applyOps(GrafOp.createReverses(this.stagedOps));
  var offset = new Vec2d().set(this.dragEnd).subtract(this.dragStart);
  this.stagedOps = this.getMoveSelectedPartsOps(offset);
  this.model.applyOps(this.stagedOps);
};

GrafEd.prototype.endDrag = function() {
  this.model.applyOps(GrafOp.createReverses(this.stagedOps));
  this.commitOps(this.stagedOps);
  this.stagedOps.length = 0;
  this.dragStart = null;
  this.dragEnd = null;
};

/**
 * Deleting a jack only deletes its links, not the jack.
 * Deleting a part deletes the part's entire cluster.
 */
GrafEd.prototype.deleteSelection = function() {
  var self = this;
  var deletedIds = {};
  var ops = [];

  function deleteCluster(cluster) {
    if (deletedIds[cluster.id]) return;
    deleteData(cluster);
    for (var id in cluster.parts) {
      deletePart(cluster.parts[id]);
    }
    ops.push({
      type: GrafOp.Type.REMOVE_CLUSTER,
      id: cluster.id
    });
    deletedIds[cluster.id] = true;
  }

  function deletePart(part) {
    if (deletedIds[part.id]) return;
    deleteData(part);
    for (var id in part.jacks) {
      deleteJack(part.jacks[id]);
    }
    ops.push({
      type: GrafOp.Type.REMOVE_PART,
      id: part.id,
      clusterId: part.clusterId,
      x: part.x,
      y: part.y
    });
    deletedIds[part.id] = true;
  }

  function deleteJack(jack) {
    if (deletedIds[jack.id]) return;
    deleteData(jack);
    deleteJackLinks(jack);
    ops.push({
      type: GrafOp.Type.REMOVE_JACK,
      id: jack.id,
      partId: jack.partId
    })
    deletedIds[jack.id] = true;
  }

  function deleteJackLinks(jack) {
    for (var id in jack.links) {
      deleteLink(self.model.getLink(id));
    }
  }

  function deleteLink(link) {
    if (deletedIds[link.id]) return;
    deleteData(link);
    ops.push({
      type: GrafOp.Type.REMOVE_LINK,
      id: link.id,
      jackId1: link.jackId1,
      jackId2: link.jackId2
    });
    deletedIds[link.id] = true;
  }

  function deleteData(obj) {
    for (var key in obj.data) {
      ops.push({
        type: GrafOp.Type.SET_DATA,
        id: obj.id,
        key: key,
        oldValue: obj.data[key]
      });
    }
  }

  var ids = this.getSelectedIds();

  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];

    var link = this.model.getLink(id);
    if (link) {
      // It's not actually possible to select a link directly yet, so this never happens.
      deleteLink(link);
    }
    var jack = this.model.getJack(id);
    if (jack) {
      // just delete links, not the jack itself
      deleteJackLinks(jack);
    }
    var part = this.model.getPart(id);
    if (part) {
      // nuke the whole cluster
      var cluster = this.model.getCluster(part.clusterId);
      if (cluster) {
        deleteCluster(cluster);
      }
    }
  }
  this.commitOps(ops);
};

/**
 * @return {Vec2d?}
 */
GrafEd.prototype.getPosById = function(id) {
  return this.geom.getPosById(id);
};

/**
 * @return {number?}
 */
GrafEd.prototype.getRadById = function(id) {
  return this.geom.getRadById(id);
};

/**
 * @return {Number}
 */
GrafEd.prototype.getSelectionsSize = function() {
  return this.selStack.size();
};

/**
 * @param callback called with no params when the model changes due to LocalStorage stuff.
 */
GrafEd.prototype.setCallback = function(callback) {
  this.invalidationCallback = function() {
    callback.call(null);
  };
  if (this.opStor) {
    this.subscribeToOpStor();
  }
};

GrafEd.prototype.unsubscribe = function() {
  if (this.opStor) {
    this.unsubscribeFromOpStor();
  }
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
 * @return a model ID, either a partId or a jackId, or null if nothing is close enough
 */
GrafEd.prototype.getNearestId = function(pos, opt_maxDist) {
  return this.geom.getNearestId(pos, opt_maxDist);
};

/**
 * Adds or removes a partId or jackId to/from the head selection.
 * @param partOrJackId
 * @param {boolean} selected true if selecting or false if unselecting
 */
GrafEd.prototype.selectById = function(partOrJackId, selected) {
  this.selStack.push((new plex.StringSet()).put(partOrJackId));
  if (selected) {
    this.selStack.add();
  } else {
    this.selStack.subtract();
  }
};

/**
 * Adds or removes partIds and jackIds to/from the head selection.
 * @param partOrJackIds
 * @param {boolean} selected true if selecting or false if unselecting
 */
GrafEd.prototype.selectByIds = function(partOrJackIds, selected) {
  var stringSet = new plex.StringSet();
  for (var i = 0; i < partOrJackIds.length; i++) {
    stringSet.put(partOrJackIds[i]);
  }
  this.selStack.push(stringSet);
  if (selected) {
    this.selStack.add();
  } else {
    this.selStack.subtract();
  }
};

/**
 * Commits ops the user manually performed.
 * Pushes to the undo stack and clears the redo stack.
 * @param {Array<GrafOp>} ops
 */
GrafEd.prototype.commitOps = function(ops) {
  this.commitOpsInternal(ops);
  this.undoStack.push(ops.concat()); // copy the ops array
  this.redoStack.length = 0;
};

/**
 * Undoes the ops on the undo stack, moving them to the redo stack.
 */
GrafEd.prototype.undo = function() {
  var ops = this.undoStack.pop();
  if (!ops) return;
  this.redoStack.push(ops);
  this.commitOpsInternal(GrafOp.createReverses(ops));
};

/**
 * Undoes the ops on the redo stack, moving them to the undo stack.
 */
GrafEd.prototype.redo = function() {
  var ops = this.redoStack.pop();
  if (!ops) return;
  this.undoStack.push(ops);
  this.commitOpsInternal(ops);
};

/**
 * Writes ops to the opstor if there is one.
 * Causes the model to be updated, maybe asynchronously.
 * @param {Array<GrafOp>} ops
 */
GrafEd.prototype.commitOpsInternal = function(ops) {
  if (this.opStor) {
    for (var i = 0; i < ops.length; i++) {
      this.opStor.appendOp(i, ops[i]);
    }
    this.syncOps();
  } else {
    // Can't bounce ops off opStor, so apply them directly.
    this.model.applyOps(ops);
  }
};

GrafEd.prototype.syncOps = function() {
  var opsSynced = 0;
  var values = this.opStor.getValuesAfterIndex(this.highestOpStorIndex);
  for (var i = 0; i < values.length; i++) {
    this.model.applyOp(values[i][OpStor.field.OP]);
    this.highestOpStorIndex = values[i][OpStor.field.OP_INDEX];
    opsSynced++;
  }
  if (opsSynced && this.invalidationCallback) {
    this.invalidationCallback.call(null);
  }
};

GrafEd.prototype.subscribeToOpStor = function() {
  if (this.opStorCallback) return;
  var self = this;
  this.opStorCallback = function() {
    self.syncOps();
  };
  this.opStor.subscribe(this.opStorCallback);
};

GrafEd.prototype.unsubscribeFromOpStor = function() {
  if (!this.opStorCallback) return;
  this.opStor.unsubscribe(this.opStorCallback);
  this.opStorCallback = null;
};
