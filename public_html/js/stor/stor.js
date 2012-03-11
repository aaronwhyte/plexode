/**
 *
 * @constructor
 */
function Stor(storage, prefix) {
  this.storage = storage;
  this.prefix = prefix;
  this.namePrefix = this.prefix + Stor.NAME;
  this.dataPrefix = this.prefix + Stor.DATA;
}

Stor.NAME = '/name/';
Stor.DATA = '/data/';

//prefix/name/awesometown-level: 123456
//prefix/data/123456/nextIndex: 1
//prefix/data/123456/0: [{...},...]
//prefix/data/123456/1: [{...},...]

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
  return this.namePrefix + dataId + '/' + index;
};

Stor.prototype.appendValues = function(name, values) {
  var nameKey = this.getKeyForName(name);
  // see if the name is there
  var dataId = this.storage.getItem(nameKey);
  if (!dataId) {
    // assign a new data address
    while (true) {
      // pick a random non-zero 32-bit number that's not in use.
      dataId = Math.floor(Math.random() * 0xfffffffe) + 1;
      if (!this.storage.getItem(this.getKeyForDataIndex(dataId, 0))) {
        // Write the new name/dataId pair.
        this.storage.setItem(nameKey, dataId);
        break;
      }
    }
  }
  // Find the first unused index.
  // TODO(awhyte) use binary search or a nextIndex counter or something.
  var nextIndex = 0;
  var dataKey;
  while (this.storage.getItem(dataKey = this.getKeyForDataIndex(dataId, nextIndex))) {
    nextIndex++;
  }
  // Write to that index.
  this.storage.setItem(dataKey, JSON.stringify(values));
};

Stor.prototype.getNames = function() {
  var names = [];
  for (var i = 0, n = this.storage.length; i < n; i++) {
    var k = this.storage.key[i];
    if (k.lastIndexOf(this.namePrefix, 0)) {
      names.push(k.substring(this.namePrefix.length));
    }
  }
  return names;
};

Stor.prototype.getValues = function(name) {
  var dataId = this.storage.getItem(this.getKeyForName(name));
  if (!dataId) return [];
  var retval = [];
  var index = 0;
  while (true) {
    var valueString = this.storage.getItem(this.getKeyForDataIndex(dataId, index++));
    if (!valueString) break;
    var values = JSON.parse(valueString);
    for (var i = 0; i < values.length; i++) {
      retval.push(values[i]);
    }
  }
  return retval;
};

//Stor.prototype.clear = function(name) {
//};
//
//Stor.prototype.subscribe = function() {
//};

