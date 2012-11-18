/**
 * This class is just a namespace for static values and methods.
 * A real cliplist op is JSON, like so:
 *
 * { type:”addClip”, timestamp:1234567890, id:"clientx-456", grafOps: [{...}, {...}, {...} ...] }
 * { type:”removeClip”, id:"clientx-456" }
 * Unlike GrafOps, ClipListOps are not reversible.
 * @param {ClipListOp.Type} type
 * @param {string} id
 * @param {number=} opt_timestamp
 * @param {Object=} opt_grafOps
 *
 * @constructor
 */
function ClipListOp(type, id, opt_timestamp, opt_grafOps) {
  this.type = type;
  this.id = id;
  if (typeof opt_timestamp != "undefined") this.timestamp = opt_timestamp;
  if (typeof opt_grafOps != "undefined") this.grafOps = opt_grafOps;
}

/**
 * @enum {string}
 */
ClipListOp.Type = {
  SET_CLIP: 'setClip',
  DELETE_CLIP: 'deleteClip'
};

ClipListOp.createAdd = function(timestamp, id, grafOps) {
  return new ClipListOp(ClipListOp.Type.SET_CLIP, id, timestamp, grafOps);
};

ClipListOp.createRemove = function(id) {
  return new ClipListOp(ClipListOp.Type.DELETE_CLIP, id);
};
