/**
 * @constructor
 */
function ClipList() {
  // Map from ID to clip
  this.clips = {};
  // List of IDs in display-order.
  this.orderedIds = [];
}

ClipList.prototype.applyOp = function(clipListOp) {
  switch (clipListOp.type) {
    case ClipListOp.Type.ADD_CLIP:
      this.addClip(clipListOp.id, Clip.createClipFromOp(clipListOp));
      break;
    case ClipListOp.Type.REMOVE_CLIP:
      this.removeClip(clipListOp.id);
      break;
    default:
      throw Error("unhandled clipListOp.type: " + clipListOp.type);
  }
};

ClipList.prototype.getClipById = function(id) {
  return this.clips[id];
};

ClipList.prototype.getClipByOrder = function(index) {
  return this.getClipById(this.orderedIds[index]);
};

ClipList.prototype.addClip = function(id, clip) {
  if (id in this.clips) {
    // TODO: Maybe make this a warning+ignore? It might be OK for add ops to be applied more than once.
    throw Error('clipListOp.id ' + id + ' is already in this.clips');
  }
  this.clips[id] = clip;
  this.orderedIds.push(id);
  this.sortOrderedIds();
};

ClipList.prototype.removeClip = function(id) {
  delete this.clips[id];
  var index = this.orderedIds.indexOf(id);
  if (index >= 0) {
    this.orderedIds.splice(index, 1);
  }
};

/**
 * Sorts the ordered ID list in reverse timestamp order (newest first).
 */
ClipList.prototype.sortOrderedIds = function() {
  var self = this;
  this.orderedIds.sort(function(id1, id2) {
    return self.clips[id2].timestamp - self.clips[id1].timestamp;
  });
};
