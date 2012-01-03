/**
 * @constructor
 */
function DepInj() {
  this.scopedInstances = {};
  this.ctrScopes = {};
  this.inScopes = {};
  this.nextKey = 444;
}

DepInj.KEY = 'PLEX_DEPINJ_KEY';

DepInj.prototype.bind = function(ctr, scope) {
  if (ctr[DepInj.KEY]) {
    throw Error('constructor ' + ctr + ' already bound.');
  }
  var key = ctr[DepInj.KEY] = this.nextKey++;
  this.ctrScopes[key] = scope;
};

DepInj.prototype.inject = function(ctr) {
  var key = ctr[DepInj.KEY];
  var scope = this.ctrScopes[key];
  this.assertInScope(scope);
  var instance = this.scopedInstances[scope][key];
  if (!instance) {
    this.scopedInstances[scope][key] = instance = new ctr();
  }
  return instance;
};

DepInj.prototype.assertInScope = function(scope) {
  if (!this.inScopes[scope]) {
    throw Error('Not in expected scope: ' + scope);
  }
};

DepInj.prototype.assertNotInScope = function(scope) {
  if (this.inScopes[scope]) {
    throw Error('In unexpected scope: ' + scope);
  }
};

DepInj.prototype.enterScope = function(scope) {
  this.assertNotInScope(scope);
  this.inScopes[scope] = true;
  if (!this.scopedInstances[scope]) {
    this.scopedInstances[scope] = {};
  }
};

/**
 * Invalidates the scope and clears its cache of instances.
 * @param scope
 */
DepInj.prototype.exitScope = function(scope) {
  this.assertInScope(scope);
  delete this.inScopes[scope];
  var instances = this.scopedInstances[scope];
  for (var key in instances) {
    delete instances[key];
  }
};
