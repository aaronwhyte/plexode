/**
 * @constructor
 */
function ClipList() {
  this.clips = {};
}

ClipList.prototype.addClip = function(id, model) {
  this.clips[id] = model;
};

ClipList.prototype.getClip = function(id) {
  return this.clips[id];
};

ClipList.prototype.removeClip = function(id) {
  delete this.clips[id];
};
