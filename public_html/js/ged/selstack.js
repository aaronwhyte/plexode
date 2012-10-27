/**
 * A stack of StringSets.
 * Supports some stack math.
 * This doesn't make defensive copies, so try not to screw up.
 * @constructor
 */
function SelStack() {
  this.stack = [];
}

/**
 * @return {Number}
 */
SelStack.prototype.size = function() {
  return this.stack.length;
};

/**
 * @param {plex.StringSet} selection
 */
SelStack.prototype.push = function(selection) {
  this.stack.push(selection);
};

/**
 * @return {plex.StringSet?} or undefined
 */
SelStack.prototype.pop = function() {
  if (!this.stack.length) return null;
  return this.stack.pop();
};

/**
 * @param {number?} opt_num  Distance from the head. Default is 0, the head.
 * @return {plex.StringSet?} or null
 */
SelStack.prototype.peek = function(opt_num) {
  var num = opt_num || 0;
  if (this.stack.length <= num) return null;
  return this.stack[this.stack.length - 1 - num] || null;
};

/**
 * Pops the top two selections and pushes the sum.
 * Does nothing if there are fewer than 2 selections.
 */
SelStack.prototype.add = function() {
  if (this.size() < 2) return;
  this.push(this.pop().add(this.pop()));
};

/**
 * Pops the top two elements and pushes the second selection minus the first one.
 * If there's just one, it pops it. If there's nothing, this does nothing.
 */
SelStack.prototype.subtract = function() {
  if (this.size() == 0) return;
  if (this.size() == 1) this.pop();
  var neg = this.pop();
  this.push(this.pop().subtract(neg));
};
