/**
 * @constructor
 */
function SledgeInvalidator() {
  this.spriteIds = {};
}

SledgeInvalidator.prototype.add = function(spriteId) {
  if (spriteId) this.spriteIds[spriteId] = true;
};

SledgeInvalidator.prototype.contains = function(spriteId) {
  return !!this.spriteIds[spriteId];
};

SledgeInvalidator.prototype.remove = function (spriteId) {
  delete this.spriteIds[spriteId];
};
