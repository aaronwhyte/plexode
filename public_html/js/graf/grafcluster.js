/**
 * @constructor
 */
function GrafCluster(op) {
  this.id = op.id;
  this.data = {}; // key/value pairs.
  this.parts = {};
}

GrafCluster.prototype.isEmpty = function() {
  for (var d in this.data) return false;
  for (var p in this.parts) return false;
  return true;
};

GrafCluster.prototype.addPart = function(part) {
  this.parts[part.id] = part;
};

GrafCluster.prototype.removePart = function(part) {
  delete this.parts[part.id];
};
