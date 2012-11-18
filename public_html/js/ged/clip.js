/**
 * @param {number} timestamp
 * @param {string} id
 * @param {GrafModel} model
 * @constructor
 */
function Clip(timestamp, id, model) {
  this.timestamp = timestamp;
  this.id = id;
  this.model = model;
}

/**
 * Creates a clip from a ClipListOp of type SET_CLIP.
 * @param {ClipListOp} op
 * @return {Clip}
 */
Clip.createClipFromOp = function(op) {
  if (op.type != ClipListOp.Type.SET_CLIP) {
    throw Error('expected op.type ' + ClipListOp.Type.SET_CLIP + ' but got ' + op.type);
  }
  var grafModel = new GrafModel();
  grafModel.applyOps(op.grafOps);
  return new Clip(op.timestamp, op.id, grafModel);
};
