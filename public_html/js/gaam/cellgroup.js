/**
 * CellCollider Cell group.
 * Grid > Cell > CellGroup > sledge*
 * @constructor
 */
function CellGroup() {
  this.sledgeIds = [];
  this.length = 0;
}

/**
 * @param {number} sledgeId
 */
CellGroup.prototype.add = function(sledgeId) {
  this.sledgeIds[this.length] = sledgeId;
  this.length++;
};

/**
 * @param {number} index
 */
CellGroup.prototype.remove = function(index) {
  if (index >= this.length || index < 0) {
    throw Error("index " + index + " out of range 0.." + this.length - 1);
  }
  this.sledgeIds[index] = this.sledgeIds[this.length - 1];
  this.length--;
};
