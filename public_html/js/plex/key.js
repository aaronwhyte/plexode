plex = plex || {};

/**
 * @param {string} name
 * @param {number} keyCode
 * @constructor
 */
plex.Key = function(name, keyCode) {
  this.name = name;
  this.keyCode = keyCode;
};

/**
 * Names of keys that don't always have a
 * readable single character representation.
 * @enum {string}
 */
plex.Key.Name = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  BACKSPACE: 'backspace',
  DELETE: 'delete',
  SPACE: 'space',
  SEMICOLON: ';',
  BACKSLASH: '\\'
};
