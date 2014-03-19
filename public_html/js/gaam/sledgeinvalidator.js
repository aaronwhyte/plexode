/**
 * A set of Sprites that do not have valid sledges.
 * This is used by Phy to defer the deletion of obsolete sledges,
 * and the creation of new sledges, until needed for collision detection or rayscans.
 * This is more efficient than keeping the sledges constantly up-to-date.
 *
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
