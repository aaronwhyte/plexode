/**
 * @constructor
 */
function Clip(timestamp, id, grafModel) {
  this.timestamp = timestamp;
  this.id = id;
  this.grafModel = grafModel;
}

/**
 * Creates a clip from a ClipListOp of type ADD_CLIP.
 * @param op
 * @return {Clip}
 */
Clip.createClipFromOp = function(op) {
  if (op.type != ClipListOp.Type.ADD_CLIP) {
    throw Error('expected op.type ' + ClipListOp.Type.ADD_CLIP + ' but got ' + op.type);
  }
  var grafModel = new GrafModel();
  grafModel.applyOps(op.grafOps);
  return new Clip(op.timestamp, op.id, grafModel);
};
