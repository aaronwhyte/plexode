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

GrafPart.prototype.hasData = function() {
  for (var d in this.data) return true;
  return false;
};

GrafPart.prototype.addJack = function(jack) {
  this.jacks[jack.id] = jack;
};

GrafPart.prototype.removeJack = function(jack) {
  delete this.jacks[jack.id];
};

GrafPart.prototype.getJack = function(id) {
  return this.jacks[id];
};

GrafPart.prototype.getJackList = function() {
  return plex.object.values(this.jacks);
};
