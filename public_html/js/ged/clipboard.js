/**
 * The UI, model, DOM thingy, storage listener, etc for a Ged clipboard.
 * @param {GrafRend} grafRend
 * @param {*} opt_storage
 * @param {string=} opt_storageKey
 * @constructor
 */
function Clipboard(grafRend, opt_storage, opt_storageKey) {
  this.grafRend = grafRend;
  this.storage = opt_storage || null;
  this.storageKey = opt_storageKey || null;

  this.listeners = null;
}

Clipboard.prototype.start = function() {
  if (this.storageKey && this.storage) {
    var opString = this.storage.getItem(this.storageKey);
    if (opString) {
      var ops = JSON.parse(opString);
      var model = new GrafModel();
      model.applyOps(ops);
      this.setInternal(model);
    }
  }
  if (!this.listeners) {
    this.listeners = new plex.event.ListenerTracker();
    if (this.storageKey) {
      this.listeners.addListener(window, 'storage', this.getStorageListener());
    }
  }
};

Clipboard.prototype.stop = function() {
  if (this.listeners) {
    this.listeners.removeAllListeners();
    this.listeners = null;
  }
};

Clipboard.prototype.setModel = function(model) {
  if (this.storage && this.storageKey) {
    this.storage.setItem(this.storageKey, JSON.stringify(model.createOps()));
  }
  this.setInternal(model);
};

Clipboard.prototype.getModel = function() {
  return this.grafRend.getModel();
};

/////////////
// private //
/////////////

Clipboard.prototype.getStorageListener = function() {
  var self = this;
  return function(e) {
    if (e.key != self.storageKey) return;
    var ops = JSON.parse(e.newValue);
    var model = new GrafModel();
    model.applyOps(ops);
    self.setInternal(model);
  };
};

Clipboard.prototype.setInternal = function(model) {
  this.grafRend.setModelContents(model);
  this.grafRend.frameContents(0.9);
  this.grafRend.draw();
};
