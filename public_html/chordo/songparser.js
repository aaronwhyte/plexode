/**
 * @constructor
 */
function SongParser() {
}

/**
 * @param {string} songText
 */
SongParser.prototype.parse = function(songText) {
  var song = new SongModel();
  var textLines = songText.split('\n');
  var parsed;
  for (var i = 0; i < textLines.length; i++) {
    var t = textLines[i];
    if (this.isLineBreak(t)) {
      song.addLineBreak();
      continue;
    }
    if (this.isMeasureBreak(t)) {
      song.addMeasureBreak();
      continue;
    }
    var chordDef = this.parseChordDef(t);
    if (chordDef) {
      song.addChordDef(chordDef);
      continue;
    }
    song.addPlayable(this.parsePlayable(t));
  }
  song.calcBestMatches();
  return song;
};

/**
 * @param {string} text
 */
SongParser.prototype.isLineBreak = function(text) {
  return /^\s*$/.test(text);
};

/**
 * @param {string} text
 */
SongParser.prototype.isMeasureBreak = function(text) {
  return /^\s*-+\s*$/.test(text);
};

SongParser.prototype.tokenize = function(text) {
  var tokens = text.trim().split(/\s+/g);
  // Splitting empty-string or whitespace results in one empty token.
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
    'fingering': strings
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
