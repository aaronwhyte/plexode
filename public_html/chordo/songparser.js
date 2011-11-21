/**
 * @constructor
 */
function SongParser() {
}

/**
 * @param {string} songText
 */
SongParser.prototype.parse = function(songText) {
  var song = [];
  var textLines = songText.split('\n');
  var parsed;
  for (var i = 0; i < textLines.length; i++) {
    var t = textLines[i];
    parsed = this.parseLineBreak(t);
    if (parsed) {
      song.push(parsed);
      continue;
    }
    parsed = this.parseMeasureBreak(t);
    if (parsed) {
      song.push(parsed);
      continue;
    }
    parsed = this.parseChordDef(t);
    if (parsed) {
      song.push(parsed);
      continue;
    }
    song.push(this.parsePlayable(t));
  }
};

/**
 * @param {string} text
 */
SongParser.prototype.parseLineBreak = function(text) {
  if (/^\s*$/.test(text)) {
    return "lineBreak";
  }
  return null;
};

/**
 * @param {string} text
 */
SongParser.prototype.parseMeasureBreak = function(text) {
  if (/^\s*-\s*$/.test(text)) {
    return "measureBreak";
  }
  return null;
};

/**
 * Parses stuff like
 * open G: //4 o o o /2 //3
 * and returns JSON like
 * {
 *   tokens: ["open", "G"],
 *   strings: ["//3", "/2", "o", "o", "o", "//4"]
 * }
 * or null if the text didn't have the right syntax
 * @param {string} text
 */
SongParser.prototype.parseChordDef = function(text) {
  var halves = /^([^:]+):([\s\/12345ox]+)$/g.exec(text);
  if (!halves) return null;
  // Now it's likely that the author was trying to define a chord.

  var keys = halves[1].split(/\s+/g);
  var vals = halves[2].split(/\s+/g);
  if (vals.length < 6) return null; // expect 6 strings

  var tokens = [];
  for (var i = 0; i < keys.length; i++) {
    if (keys[i]) {
      tokens.push(keys[i]);
    }
  }
  if (tokens.length == 0) return null; // need at least one token

  var strings = [];
  for (var i = 0; i < vals.length; i++) {
    if (!vals[i]) continue;
    if (!/^([ox]|([\/12345]*[12345]))$/.test(vals[i])) {
      return null;
    }
    strings.push(vals[i]);
  }
  if (strings.length != 6) return null; // expect 6 strings

  return {
    'tokens': tokens,
    'strings': strings
  };
};

/**
 * This is the last thing we try, so it never returns null.
 * In other words: Garbage in, lyrics out!
 * Returns JSON like
 * {
 *   tokens: ["G", "open"],
 *   lyrics: "Sing while you code"
 * }
 * @param {string} text
 */
SongParser.prototype.parsePlayable = function(text) {
  // IMPLEMENT ME
};