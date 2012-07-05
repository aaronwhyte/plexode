/**
 * A store for a single stream of operations, indexed by the server-assigned operation ID.
 * Backed by one namd Stor object.
 * @constructor
 */
function OpStor(stor, name) {
  this.stor = stor;
  this.name = name;
}

/**
 * Appends a new value to the stor. Creates a new names object if the name isn't in use.
 * @param clientOpId
 * @param op The actual operation payload
 * @return the server ID of the appended value
 */
OpStor.prototype.appendOp = function(clientOpId, op) {
  var nextIndex = this.stor.getNextIndex(this.name);
  var value = [nextIndex, clientOpId, op];
  var actualIndex = this.stor.appendValue(this.name, value);
  if (nextIndex != actualIndex) throw Error("nextIndex " + nextIndex + " != actualIndex " + actualIndex);
  return actualIndex;
};

/**
 * @param {number} afterIndex
 * @return {Array} ops
 */
OpStor.prototype.getOpsAfterIndex = function(afterIndex) {
  return this.stor.getValuesAfterIndex(this.name, afterIndex);
};

/**
 * Register a callback that gets called with no parameters, just to trigger invalidation.
 * @param {function} callback
 */
OpStor.prototype.subscribe = function(callback) {
  this.stor.subscribe(function() {
    callback();
  });
};
