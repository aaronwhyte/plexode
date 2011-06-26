/**
 * A SkipQueue priority queue, ordered by time.
 * Nodes must have a "time" value, and this SkipQueue will
 * manage a "next" array, too.
 * @constructor
 */
function SkipQueue(expectedLength) {
  this.maxLevel = Math.ceil(Math.log(expectedLength) / Math.log(SkipQueue.BASE));
  this.level = this.maxLevel;
  this.next = [];
  this.size = 0;  
  this.prevs = [];
};

SkipQueue.BASE = 2;
SkipQueue.LEVEL_UP_ODDS = 1 / SkipQueue.BASE;

SkipQueue.prototype.randomLevel = function() {
  var level = 0;
  var rand = Math.random();
  var bar = SkipQueue.LEVEL_UP_ODDS;
  while (rand < bar && level < this.maxLevel) {
    level++;
    bar *= SkipQueue.LEVEL_UP_ODDS;
  }
  return level;
};

/**
 * Add a node, in the right order.
 * @param {Object} addMe
 */
SkipQueue.prototype.add = function(addMe) {
  if (!addMe) throw "addMe is " + addMe;
  var prevs = this.prevs;
  if (!addMe.next) {
    addMe.next = [];
  }
  addMe.level = this.randomLevel();
  
  // set up for traversal
  var level = this.maxLevel;
  var node = this;
  
  var next;
  for (var level = this.maxLevel; level >= 0; --level) {
    // right
    next = node.next[level];
    while (next && next.time < addMe.time) {
      node = next;
      next = node.next[level];
    }
    prevs[level] = node;
  }
  // For the levels that this node blocks, do inserts.
  for (level = addMe.level; level >= 0; --level) {
    addMe.next[level] = prevs[level].next[level];
    prevs[level].next[level] = addMe;
  }
  this.size++;
};

/**
 * Returns the first node, or null if empty, and also removes it.
 */
SkipQueue.prototype.removeFirst = function() {
  var node = this.next[0];
  if (!node) return null;
  for (var level = node.level; level >= 0; --level) {
    this.next[level] = node.next[level];
  }
  this.size--;
  return node;
};

/**
 * Returns the first node without removing it.
 */
SkipQueue.prototype.getFirst = function() {
  return this.next[0];
};

SkipQueue.prototype.toString = function() {
  var node = this.next[0];
  var out = [];
  while (node != null) {
    out.push(node.toString());
    node = node.next[0];
  }
  return '[' + out.join(',\n') + ']';
};