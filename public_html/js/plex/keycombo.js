plex = plex || {};

/**
 * @param {number} keyCode
 * @param {Array<string>} opt_modifiers a list of the modifier keys that must be true
 * for this to match a key event. Every modifier not required to be true is required to be false.
 * @constructor
 */
plex.KeyCombo = function(keyCode, opt_modifiers) {
  this.keyCode = keyCode;
  this.modifiers = opt_modifiers || [];
};

/**
 * @param event a keyboard event
 * @return {Boolean}
 */
plex.KeyCombo.prototype.matches = function(event) {
  if (event.keyCode != this.keyCode) return false;
  for (var k in plex.KeyModifier) {
    var modifier = plex.KeyModifier[k];
    var expectedValue = plex.array.contains(this.modifiers, modifier);
    if (expectedValue != event[modifier]) return false;
  }
  return true;
};
