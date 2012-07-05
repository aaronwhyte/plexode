/**
 * This class is just a namespace for static values and methods.
 * A real cliplist op is JSON, like so:
 *
 * { type:”addClip”, timestamp:1234567890, id:"clientx-456", grafOps: [{...}, {...}, {...} ...] }
 * { type:”removeClip”, id:"clientx-456" }
 * Unlike GrafOps, ClipListOps are not reversible.
 */
function ClipListOp() {}

/**
 * @enum {string}
 */
ClipListOp.Type = {
  ADD_CLIP: 'addClip',
  REMOVE_CLIP: 'removeClip'
};

ClipListOp.createAdd = function(timestamp, id, grafOps) {
  return {
    type: ClipListOp.Type.ADD_CLIP,
    timestamp: timestamp,
    id: id,
    grafOps: grafOps
  };
};

ClipListOp.createRemove = function(id) {
  return {
    type: ClipListOp.Type.REMOVE_CLIP,
    id: id
  };
};