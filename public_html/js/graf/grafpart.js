/**
 * @constructor
 */
function GrafPart(op) {
  this.id = op.id;
  this.data = {};
  this.clusterId = op.clusterId;
  this.x = op.x;
  this.y = op.y;
  this.jacks = {};
}

GrafPart.prototype.isEmpty = function() {
  for (var d in this.data) return false;
  for (var j in this.jacks) return false;
  return true;
};


GrafPart.prototype.addJack = function(jack) {
  this.jacks[jack.id] = jack;
};

GrafPart.prototype.removeJack = function(jack) {
  delete this.jacks[jack.id];
};
