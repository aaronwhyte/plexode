/**
 * Map from GedUI.Action to plex.KeyEventDesc
 * @param {plex.Keys} keys for getting keycodes
 * @constructor
 */
function GrafUiKeyCombos(keys) {
  this.keys = keys;
  // map from action to array of key event descs
  this.keyEventDescs = null;
}

/**
 * @return map from action name to keyEventDesc
 */
GrafUiKeyCombos.prototype.getAll = function() {
  if (!this.keyEventDescs) {
    this.keyEventDescs = {};
    var self = this;
    function ked(action, keyName, opt_modifiers) {
      if (!self.keyEventDescs[action]) {
        self.keyEventDescs[action] = [];
      }
      self.keyEventDescs[action].push(new plex.KeyCombo(
          self.keys.getKeyCodeForName(keyName),
          opt_modifiers));
    }

    var SHIFT = [plex.KeyModifier.SHIFT];

    ked(GrafUi.Action.SELECT, 's');
    ked(GrafUi.Action.UNSELECT, 's', SHIFT);
    ked(GrafUi.Action.ADD_SELECTIONS, 'a');
    ked(GrafUi.Action.SUBTRACT_SELECTIONS, 'a', SHIFT);

    ked(GrafUi.Action.COPY, 'c');
    ked(GrafUi.Action.PASTE, 'v');
    ked(GrafUi.Action.DELETE, plex.Key.Name.DELETE);
    ked(GrafUi.Action.DELETE, plex.Key.Name.BACKSPACE);

    ked(GrafUi.Action.DRAG, 'd');
    ked(GrafUi.Action.LINK, 'l');

    ked(GrafUi.Action.UNDO, 'z');
    ked(GrafUi.Action.REDO, 'z', SHIFT);
  }
  return this.keyEventDescs;
};

GrafUiKeyCombos.prototype.getCombo = function(action) {
  return this.getAll()[action];
};

GrafUiKeyCombos.prototype.eventMatchesAction = function(event, action) {
  var eventDescs = this.getCombo(action)
  if (!eventDescs) return false;
  for (var i = 0; i < eventDescs.length; i++) {
    var desc = eventDescs[i];
    if (desc.matches(event)) return true;
  }
  return false;
};
