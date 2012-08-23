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

/**
 * @param {GrafModel} clipModel
 * @param {Vec2d} offset
 */
LevelEd.prototype.pasteModel = function(clipModel, offset) {
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
};

/**
 * @param {Vec2d} pos
 * @param {number=} opt_maxDist
 * @return a model ID, either a partId or a jackId
 */
LevelEd.prototype.getNearestId = function(pos, opt_maxDist) {
  opt_maxDist == opt_maxDist || 10;
  var partPos = new Vec2d();
  var leastDistSq = opt_maxDist * opt_maxDist;
  var retId = null;
  for (var partId in this.model.parts) {
    var part = this.model.parts[partId];
    partPos.setXY(part.x, part.y);
    var distSq = partPos.distanceSquared(pos);
    if (distSq < leastDistSq) {
      retId = part.id;
      leastDistSq = distSq;
    }
  }
  // TODO: accessible vector offsets for input + output jacks
  return retId;
};

LevelEd.prototype.select = function(partOrJackId, selected) {
  if (selected) {
    this.selection[partOrJackId] = true;
  } else {
    delete this.selection[partOrJackId];
  }
};

LevelEd.prototype.clearSelection = function() {
  for (var id in this.selection) {
    delete this.selection[id];
  }
};

LevelEd.prototype.moveSelectedParts = function(deltaPos) {
  var ops = [];
  for (var id in this.selection) {
    var part = this.model.getPart(id);
    if (!part) continue; // may be a jack
    ops.push({
      type: GrafOp.Type.MOVE_PART,
      id: id,
      x: part.x + deltaPos.x,
      y: part.y + deltaPos.y,
      oldX: part.x,
      oldY: part.y
    });
  }
  this.model.applyOps(ops);
};

// TODO: levelEd.linkSelectedJacks()
