/**
 * A key/valuelist store where .
 * @param {Object} storage  usually localStorage or sessionStorage
 * @param {String} prefix A prefix to identify all the keys in storage that belong to this Stor.
 * @constructor
 */
function Stor(storage, prefix) {
  this.storage = storage;
  this.prefix = prefix;

  this.namePrefix = this.prefix + '/' + Stor.NAME + '/';
  this.dataPrefix = this.prefix + '/' + Stor.DATA + '/';
  this.lastIndex = {}; // cache of dataId to lastIndex
  this.idToName = {}; // another awesome cache
  this.pubsub = new plex.PubSub();
}

Stor.NAME = 'name';
Stor.DATA = 'data';

Stor.Ops = {
  APPEND_VALUE: 'append_value'
};

//prefix/name/awesometown-level: 123456
//prefix/data/123456/1: [{...},...]
//prefix/data/123456/2: [{...},...]

Stor.prototype.listenToStorage = function() {
  window.addEventListener("storage", this.getStorageListener(), true);
};

Stor.prototype.getStorageListener = function() {
  var self = this;
  return function storStorageListener(e) {
    var path = e.key.split('/');
    if (!path || path.length != 4 || path[0] != self.prefix || path[1] != Stor.DATA) {
      return;
    }
    var id = path[2];
    var name = self.getNameForId(id);
    if (name) {
      self.pubsub.publish(Stor.Ops.APPEND_VALUE, name, JSON.parse(e.newValue));
    }
  };
};

/**
 * @return {Array} the names of all the objects in this Stor
 */
Stor.prototype.getNames = function() {
  var names = [];
  for (var i = 0, n = this.storage.length; i < n; i++) {
    var k = this.storage.key(i);
    if (0 == k.lastIndexOf(this.namePrefix, 0)) {
      var name = k.substring(this.namePrefix.length);
      names.push(name);
      // populate idToName map while we're at it.
      var scanId = this.storage.getItem(this.getKeyForName(name));
      this.idToName[scanId] = name;
    }
  }
  return names;
};

/**
 * Appends new values to the stor. Creates a new names object if the name isn't in use.
 * @param name
 * @param values
 */
Stor.prototype.appendValues = function(name, values) {
  for (var i = 0; i < values.length; i++) {
    this.appendValue(name, values[i]);
  }
};

/**
 * Lazilly creates a data ID for this Stor, and returns it.
 * @param {String} name
 * @return {String} data ID
 */
Stor.prototype.getDataId = function(name) {
  var nameKey = this.getKeyForName(name);
  // see if the name is there
  var dataId = this.storage.getItem(nameKey);
  if (!dataId) {
    // assign a new data address
    while (true) {
      // pick a random non-zero 32-bit number that's not in use.
      dataId = Math.floor(Math.random() * 0xfffffffe) + 1;
      if (!this.storage.getItem(this.getKeyForDataIndex(dataId, 1))) {
        // Write the new name/dataId pair.
        this.storage.setItem(nameKey, dataId);
        break;
      }
    }
  }
  // keep the cache fresh
  this.idToName[dataId] = name;
  return dataId;
};

/**
 * Appends a new value to the stor. Creates a new names object if the name isn't in use.
 * @param name
 * @param value
 * @return the index of the newly appended value
 */
Stor.prototype.appendValue = function(name, value) {
  var dataId = this.getDataId(name);
  // Find the first unused index.
  var nextIndex = (this.lastIndex[dataId] || 0) + 1;
  var dataKey;
  while (this.storage.getItem(dataKey = this.getKeyForDataIndex(dataId, nextIndex))) {
    nextIndex++;
  }
  // Write to that index.
  this.storage.setItem(dataKey, JSON.stringify(value));
  // Cache the last index value, to avoid a chain of lookups next time.
  this.lastIndex[dataId] = nextIndex;

//  // Windows won't publish storage events they initiate, so publish one ourselves.
//  var self = this;
//  window.setTimeout(function(){self.pubsub.publish(Stor.Ops.APPEND_VALUE, name, value)}, 0);

  return this.lastIndex[dataId];
};

/**
 * All the values for one name in this Stor
 * @param name
 * @return {Array} of values, in the order in which they were inserted.
 */
Stor.prototype.getValues = function(name) {
  return this.getValuesAfterIndex(name, 0);
};

/**
 * All the values for one name in this Stor after some index
 * @param {string} name
 * @param {number} afterIndex
 * @return {Array} of values, in the order in which they were inserted.
 */
Stor.prototype.getValuesAfterIndex = function(name, afterIndex) {
  var dataId = this.storage.getItem(this.getKeyForName(name));
  if (!dataId) return [];
  var retval = [];
  if (isNaN(afterIndex)) throw Error("afterIndex is not a number: " + afterIndex);
  var index = Math.max(1, afterIndex + 1);
  while (true) {
    var valueString = this.storage.getItem(this.getKeyForDataIndex(dataId, index++));
    if (!valueString) break;
    var value = JSON.parse(valueString);
    retval.push(value);
  }
  return retval;
};

/**
 * @return {number} the next available index for the named item
 */
Stor.prototype.getNextIndex = function(name) {
  var dataId = this.storage.getItem(this.getKeyForName(name));
  var nextIndex = (this.lastIndex[dataId] || 0) + 1;
  var dataKey;
  while (this.storage.getItem(dataKey = this.getKeyForDataIndex(dataId, nextIndex))) {
    nextIndex++;
  }
  return nextIndex;
};

/**
 * Subscribe to the change-publisher. The listener will be called
 * with three params, like so:
 * fn(Stor.Ops.APPEND_VALUE, name, values);
 * @param fn
 */
Stor.prototype.subscribe = function(fn) {
  this.pubsub.subscribe(fn);
};

Stor.prototype.unsubscribe = function(callback) {
  this.pubsub.unsubscribe(callback);
};

/**
 * @private
 */
Stor.prototype.getKeyForName = function(name) {
  return this.namePrefix + name;
};

/**
 * @private
 */
Stor.prototype.getKeyForDataIndex = function(dataId, index) {
  return this.dataPrefix + dataId + '/' + index;
};

/**
 * Very expensive if the ID is not a real ID!
 * @private
 */
Stor.prototype.getNameForId = function(id) {
  // check the cache first
  var name = this.idToName[id];
  if (name) return name;

  // Scan all keys and populate the entire idToName cache.
  var retval = null;
  for (var i = 0, n = this.storage.length; i < n; i++) {
    var k = this.storage.key(i);
    if (0 == k.lastIndexOf(this.namePrefix, 0)) {
      // it is a name in this stor
      name = k.substring(this.namePrefix.length);
      var scanId = this.storage.getItem(this.getKeyForName(name));
      this.idToName[scanId] = name;
      if (scanId == id) {
        retval = name;
      }
    }
  }
  return retval;
};
