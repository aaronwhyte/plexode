/**
 * A store for a single stream of operations, indexed by the server-assigned operation ID.
 * Backed by one named object within a Stor.
 * @param {Stor} stor
 * @param {String} name
 * @constructor
 */
function OpStor(stor, name) {
  this.stor = stor;
  this.name = name;
}

/**
 * @enum {Number
 */
OpStor.field = {
  OP_INDEX: 0,
  CLIENT_OP_ID: 1,
  OP: 2
};

/**
 * @return {Stor}
 */
OpStor.prototype.getStor = function() {
  return this.stor;
};

/**
 * @return {String}
 */
OpStor.prototype.getName = function() {
  return this.name;
};

/**
 * Appends a new value to the opstor. Creates a new named object if the name isn't in use.
 * @param clientOpId used by clients to re-order non-idempotent ops when there are multiple clients.
 *     See design doc.
 * @param op The actual operation payload
 * @return the server ID of the appended value
 */
OpStor.prototype.appendOp = function(clientOpId, op) {
  var nextIndex = this.stor.getNextIndex(this.name);
  var value = [nextIndex, clientOpId, op];
  var actualIndex = this.stor.appendValue(this.name, value);
  if (nextIndex != actualIndex) {
    throw Error("nextIndex " + nextIndex + " != actualIndex " + actualIndex);
  }
  return actualIndex;
};

/**
 * Writes metadata for this opstor if there isn't any in the store yet.
 */
OpStor.prototype.touch = function() {
  this.stor.getDataId(this.name);
};

/**
 * @param {number} afterIndex
 * @return {Array<Array>} an array of rows where each has the fields in OpStor.fields.
 */
OpStor.prototype.getValuesAfterIndex = function(afterIndex) {
  return this.stor.getValuesAfterIndex(this.name, afterIndex);
};

/**
 * Register a callback that gets called with no parameters, just to trigger invalidation.
 * @param {function} callback
 */
OpStor.prototype.subscribe = function(callback) {
  this.stor.subscribe(callback);
};

OpStor.prototype.unsubscribe = function(callback) {
  this.stor.unsubscribe(callback);
};
