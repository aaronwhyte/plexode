this.plex = this.plex || {};

/**
 * Simply associates numeric keycodes  programmer-friendly names.
 * @constructor
 */
plex.Keys = function() {
  // Index the keys by both fields.
  this.byKeyCode = {};
  this.byName = {};

  this.initialized = false;
};

plex.Keys.prototype.getKeyCodeForName = function(name) {
  if (!this.initialized) this.initKeys();
  var key = this.byName[name];
  return key ? key.keyCode : null;
};

plex.Keys.prototype.getNameForKeyCode = function(keyCode) {
  if (!this.initialized) this.initKeys();
  var key = this.byKeyCode[keyCode];
  return key ? key.name : null;
};

/**
 *  Add all letters, numbers, and plex.Key.Name values to byKeyCode and byName indexes.
 */
plex.Keys.prototype.initKeys = function() {
  var self = this;

  function addKey(name, keyCode) {
    var key = new plex.Key(name, keyCode);
    self.byName[name] = key;
    self.byKeyCode[keyCode] = key;
  }

  function addKeySequence(firstChar, firstKeyCode, lastChar) {
    var firstCharCode = firstChar.charCodeAt(0);
    var lastCharCode = lastChar.charCodeAt(0);
    if (firstCharCode > lastCharCode) throw Error(firstChar + ' > ' + lastChar);
    var keyCode = firstKeyCode;
    for (var charCode = firstCharCode; charCode <= lastCharCode; charCode++) {
      addKey(String.fromCharCode(charCode), keyCode);
      keyCode++;
    }
  }
  addKeySequence('a', 65, 'z');
  addKeySequence('0', 48, '9');

  addKey(plex.Key.Name.LEFT, 37);
  addKey(plex.Key.Name.UP, 38);
  addKey(plex.Key.Name.RIGHT, 39);
  addKey(plex.Key.Name.DOWN, 40);

  addKey(plex.Key.Name.BACKSPACE, 8);
  addKey(plex.Key.Name.DELETE, 46);
  addKey(plex.Key.Name.SPACE, 32);

  addKey(plex.Key.Name.SEMICOLON, 186);
  addKey(plex.Key.Name.BACKSLASH, 220);

  addKey(plex.Key.Name.ESC, 27);

  this.initialized = true;
};