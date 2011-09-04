/**
 * @constructor
 */
function GrafJack(op) {
  this.id = op.id;
  this.data = {}; // key/value pairs.
  this.partId = op.partId;
  this.links = {};
}

GrafJack.prototype.isEmpty = function() {
  for (var d in this.data) return false;
  for (var l in this.links) return false;
  return true;
};

GrafJack.prototype.addLink = function(link) {
  this.links[link.id] = link;
};

GrafJack.prototype.removeLink = function(link) {
  delete this.links[link.id];
};
