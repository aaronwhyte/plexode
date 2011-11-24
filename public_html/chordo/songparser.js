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
  return song;
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
  if (/^\s*-+\s*$/.test(text)) {
    return "measureBreak";
  }
  return null;
};

SongParser.prototype.tokenize = function(text) {
  var tokens = text.trim().split(/\s+/g);
  // Spritting empty-string or whitespace results in one empty token.
  if (tokens.length == 1 && !tokens.length) return [];
  return tokens;
};

/**
 * Parses stuff like
 * open G: //4 o o o /2 //3
 * and returns JSON like
 * {
 *   tokens: ["open", "C"],
 *   strings: ["x", "//3", "/2", "o", "o", "1"]
 * }
 * or null if the text didn't have the right syntax
 * @param {string} text
 */
SongParser.prototype.parseChordDef = function(text) {
  var halves = /^([^:]+):([\s\/12345ox]+)$/g.exec(text);
  if (!halves) return null;
  // Now it's likely, but not certain,
  // that the author was trying to define a chord.
  var tokens = this.tokenize(halves[1]);
  var strings = this.tokenize(halves[2]);
  if (strings.length != 6) return null; // expect 6 strings
  for (var i = 0; i < strings.length; i++) {
    if (!/^([ox]|([\/12345]*[12345]))$/.test(strings[i])) {
      return null;
    }
  }
  return {
    'tokens': tokens,
    'strings': strings
  };
};

/**
 * This is the last thing we try, so it must never return null.
 * If there's no colon, then treat everything as tokens.
 * Returns JSON like
 * {
 *   tokens: ["G", "open"],
 *   lyrics: "Sing while you code"
 * }
 * @param {string} text
 */
SongParser.prototype.parsePlayable = function(text) {
  var colonIndex = text.indexOf(':');
  var tokensText, lyrics;
  if (colonIndex == -1) {
    tokensText = text;
    lyrics = "";
  } else {
    tokensText = text.substr(0, colonIndex);
    lyrics = text.substr(colonIndex + 1, text.length).trim();
  }
  return {
    'tokens': this.tokenize(tokensText),
    'lyrics': lyrics
  };
};