/**
 * @constructor
 */
function GrafLink(op) {
  this.id = op.id;
  this.data = {}; // key/value pairs.
  this.jackId1 = op.jackId1;
  this.jackId2 = op.jackId2;
}

GrafLink.prototype.isEmpty = function() {
  for (var d in this.data) return false;
  return true;
};
