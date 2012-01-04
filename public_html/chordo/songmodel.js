/**
 * @constructor
 */
function SongModel() {
  this.layout = [];

  // key: string of tokens like "C open"
  // val: object like {tokens: ["C", "open"], fingering: [...]
  this.fingerings = {};

  // key: playable chord query like "o C"
  // val: the list of tokens, like ["o", "C"]
  this.toMatch = {};

  // key: playable chord query
  // val: fingering key, in "fingerings"
  this.matches = null;
}

SongModel.MEASURE_BREAK = 1;
SongModel.LINE_BREAK = 2;

SongModel.prototype.addChordDef = function(c) {
  this.layout.push(c);
  this.fingerings[c.tokens.join(' ')] = c;
};

SongModel.prototype.addPlayable = function(p) {
  this.layout.push(p);
  // remember to score this later
  this.toMatch[p.tokens.join(' ')] = p.tokens;
};

SongModel.prototype.addMeasureBreak = function() {
  this.layout.push(SongModel.MEASURE_BREAK);
};

SongModel.prototype.addLineBreak = function() {
  this.layout.push(SongModel.LINE_BREAK);
};

SongModel.prototype.getFingeringForPlayable = function(playable) {
  var queryStr = playable.tokens.join(' ');
  var fingeringKey = this.matches[queryStr];
  return this.fingerings[fingeringKey];
}

/**
 * Fill in matches.
 */
SongModel.prototype.calcBestMatches = function() {
  this.matches = {};
  for (var key in this.toMatch) {
    this.matches[key] = this.calcBestMatch(this.toMatch[key]);
  }
};

/**
 * Returns the best fingering key match, or null if there's nothing good.
 */
SongModel.prototype.calcBestMatch = function(queryTokens) {
  var bestKey = null;
  var bestScore = -Infinity;
  for (var key in this.fingerings) {
    var score = this.scoreQuery(queryTokens, this.fingerings[key]['tokens']);
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }
  return bestScore > 500 ? bestKey : null;
};

/**
 * A perfect match on a token is 10000 points.
 * 1000 points for a query which is a prefix of a definition token, minus 100
 * for every unmatched def char.
 * Completely unmatched definition tokens (no prefix match even) are -10.
 * Unmatched tokens in the query are -1
 */
SongModel.prototype.scoreQuery = function(queryTokens, fingeringTokens) {
  var total = 0;
  for (var q = 0; q < queryTokens.length; q++) {
    var qt = queryTokens[q];

    // Calc the best score for this query token.
    var highScore = -10;
    for (var f = 0; f < fingeringTokens.length; f++) {
      var ft = fingeringTokens[f];
      var score = -10;
      if (qt == ft) {
        // perfect match
        score = 10000;
      } else if (ft.indexOf(qt) == 0) {
        // prefix match
        score = 1000 - 100 * Math.abs(ft.length - qt.length);
      }
      highScore = Math.max(highScore, score);
    }
    total += highScore;
  }
  return total;
};
