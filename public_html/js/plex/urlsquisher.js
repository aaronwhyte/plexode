/**
 * @constructor
 */
plex.UrlSquisher = function() {
  this.legalChars = plex.url.TOTES_SAFE_HASH_CHARS;
};

plex.UrlSquisher.prototype.squish = function(url) {
  this.monoCharIndex = -1;
  this.biCharIndex = 0;
  // Firefox's location.href will turn a single-quote in a hash into "%27".
  // So don't ever allow single-quotes in squished URLs.
  url = url.replace(/'/g, '%27');
  var text = "~" + url;
  var subChar;
  while (subChar = this.getAvailableShortStr(text)) {
    var levels = this.calcAllLevels(text);
    var original = this.calcBestOriginal(levels, subChar);
    if (!original) break;
    text = this.squishStep(subChar, original, text);
  }
  return text;
};

plex.UrlSquisher.prototype.unsquish = function(squishedText) {
  var text = squishedText;
  // The loop condition prevents an infinite loop for bad input.
  var count = 0;
  while (count < 1000) {
    count++;
    var c = text.charAt(0);
    if (c == "~") {
      // The rest is the body.
      text = text.substr(1);
      break;
    }
    text = this.unsquishStep(text);
  }
  return text;
};

plex.UrlSquisher.prototype.unsquishStep = function(text) {
  var c = text.charAt(0);
  var lens = this.decodeLenChar(c);
  var subLen = lens.subLen;
  var origLen = lens.origLen;
  var sub = text.substr(1, subLen);
  var original = text.substr(1 + subLen, origLen);

  text = text.substr(1 + subLen + origLen);
  text = plex.string.replace(text, sub, original);
  return text;
};

/**
 * Figure out what short string is unused.
 */
plex.UrlSquisher.prototype.getAvailableShortStr = function(url) {
  while (++this.monoCharIndex < this.legalChars.length) {
    var c = this.legalChars.charAt(this.monoCharIndex);
    if (url.indexOf(c) < 0) return c;
  }
  var squareLen = this.legalChars.length * this.legalChars.length;
  while (++this.biCharIndex < squareLen) {
    var x = Math.floor(this.biCharIndex / this.legalChars.length);
    var y = this.biCharIndex % this.legalChars.length;
    if (x == y) continue;
    var str = this.legalChars.charAt(x) + this.legalChars.charAt(y);
    if (url.indexOf(str) < 0) return str;
  }
  return null;
};

plex.UrlSquisher.prototype.calcAllLevels = function(input) {
  var tokens = plex.url.tokenizeEncodedUrl(input);
  var levels = [];

  levels[1] = new plex.UrlSquisher.RepLevel(tokens, 1);

  // For each token, remember where it appears.
  for (var i = 0; i < tokens.length; i++) {
    levels[1].add(i);
  }
  levels[1].removeUniques();

  var i = 2;
  while (true) {
    levels[i] = new plex.UrlSquisher.RepLevel(tokens, i);
    levels[i].addFromPrevLevel(levels[i - 1]);
    levels[i].removeUniques();
    if (levels[i].length == 0) {
      levels.pop();
      break;
    }
    i++;
  }
  for (var i = 2; i < levels.length; i++) {
    levels[i].removeSelfOverlaps();
    levels[i].removeUniques();
  }
  for (var i = 2; i < levels.length; i++) {
    levels[i].supercede(levels[i - 1]);
  }
  return levels;
};


plex.UrlSquisher.prototype.calcBestOriginal = function(levels, replacement) {
  // Now evaluate all the subs and pull out the best one.
  function calcBenefit(originalLength, substitutionLength, frequency) {
    return originalLength * (frequency - 1) - substitutionLength * (frequency + 1) - 1;
  }
  var bestOriginal = null;
  var bestBenefit = 0;
  for (var i = 1; i < levels.length; i++) {
    var level = levels[i];
    var keys = level.map.getKeys();
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      var benefit = calcBenefit(key.length, replacement.length, level.map.get(key).length);
      if (benefit > bestBenefit) {
        bestOriginal = key;
        bestBenefit = benefit;
      }
    }
  }
  return bestOriginal;
};

plex.UrlSquisher.prototype.squishStep = function(subChar, original, text) {
  var command = this.encodeLenChar(subChar.length, original.length) + subChar + original;
  var squished = command + plex.string.replace(text, original, subChar);
  return squished;
};

plex.UrlSquisher.prototype.checkSubLens = function(subLen, origLen) {
  if (Math.floor(subLen) != subLen || subLen < 1 || subLen > 4) {
    throw Error("Illegal subLen " + subLen);
  }
  if (Math.floor(origLen) != origLen || origLen < 1 || origLen > 16) {
    throw Error("Illegal origLen " + origLen);
  }
};

/**
 * Encodes into a 6 bit number, encoded in base-82, a single URL-legal char.
 * low 2 bits represent subLen 1-4.
 * next 4 bits represent origLen 1-16.
 */
plex.UrlSquisher.prototype.encodeLenChar = function(subLen, origLen) {
  this.checkSubLens(subLen, origLen);
  var lenBits = (subLen - 1) + 4 * (origLen - 1);
  if (lenBits < 0 || lenBits >= this.legalChars.length) {
    throw Error("cannot encode lenBits " + lenBits);
  }
  var retval = this.legalChars.charAt(lenBits);
  if (retval < 0) {
    throw Error("No legal character can encode bit value" + lenBits);
  }
  var check = this.decodeLenChar(retval);
  if (check.subLen != subLen) {
    throw Error(["check.subLen != subLen", check.subLen, subLen].join(' '));
  }
  if (check.origLen != origLen) {
    throw Error(["check.origLen != origLen", check.origLen, origLen].join(' '));
  }
  return retval;
};

plex.UrlSquisher.prototype.decodeLenChar = function(c) {
  var bits = this.legalChars.indexOf(c);
  if (bits < 0) throw Error("Invalid bits char '" + c + "'");
  var subLen = (bits & 3) + 1;
  var origLen = Math.floor(bits / 4) + 1;
  this.checkSubLens(subLen, origLen);
  return {subLen: subLen, origLen: origLen};
};

/**
 * Tracks all repeat occurences of chains of tokens.
 * All chains in one RepLevel are of the same length.
 * @param tokens  the array of tokens
 * @param chainLen  the length of the token chains at this level
 * @constructor
 */
plex.UrlSquisher.RepLevel = function(tokens, chainLen) {
  this.tokens = tokens;
  this.chainLen = chainLen;

  // Each key is a token chain joined with empty string, like "abc%20123".
  // Each value is an array of starting points where the chain appears.
  this.map = new plex.Map();
  this.length = 0;
};

/**
 * @param startPos
 */
plex.UrlSquisher.RepLevel.prototype.add = function(startPos) {
  var key = this.getKey(startPos);
  if (key.length > 16) {
    // Do not add keys longer than 16 chars,
    // since we can't encode them.
    return;
  }
  var list = this.map.get(key);
  if (!list) {
    this.map.set(key, list = []);
  }
  list.push(startPos);
  this.length++;
};

plex.UrlSquisher.RepLevel.prototype.addFromPrevLevel = function(prevLevel) {
  if (prevLevel.chainLen != this.chainLen - 1) {
    throw Error("expected prev level chainlen " + this.chainLen - 1 +
        " but got " + prevLevel.chainLen);
  }
  var starts = prevLevel.getAllStarts();
  for (var start in starts) {
    if (starts[start - 1]) {
      this.add(start - 1);
    }
  }
};

/**
 * Alters the prevLevel like so:
 * For every repeated chain in this level,
 * if if covers all the instances of a repeated chain in the prevLevel,
 * then delete the repeated chain from the prevLevel.
 */
plex.UrlSquisher.RepLevel.prototype.supercede = function(prevLevel) {
  function smallCoveredByBig(smallStarts, bigStarts) {
    for (var i = 0; i < smallStarts.length; i++) {
      if (bigStarts.indexOf(smallStarts[i]) == -1 &&
          bigStarts.indexOf(smallStarts[i] - 1) == -1) {
        return false;
      }
    }
    return true;
  }
  if (prevLevel.chainLen != this.chainLen - 1) {
    throw Error("expected prev level chainlen " + this.chainLen - 1 +
        " but got " + prevLevel.chainLen);
  }
  // Look at all the entries in the nextLevel map
  var keys = this.map.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var starts = this.map.get(key);
    var shortKeys = [
      prevLevel.getKey(starts[0]),
      prevLevel.getKey(starts[0] + 1)
    ];
    // Look each of the two prevLevel chains.
    // If one has the same count as the longer chain,
    // then it is safe to remove.
    for (var j = 0; j < 2; j++) {
      var shortKey = shortKeys[i];
      var shortStarts = prevLevel.map.get(shortKey);
      if (shortStarts) {
        if (shortStarts.length == starts.length) {
            //smallCoveredByBig(shortStarts, starts)) {
          prevLevel.remove(shortKey);
        }
      }
    }
  }
};

plex.UrlSquisher.RepLevel.prototype.getTokens = function(startPos) {
  var a = [];
  for (var i = 0; i < this.chainLen; i++) {
    a.push(this.tokens[startPos + i]);
  }
  return a;
};

plex.UrlSquisher.RepLevel.prototype.getKey = function(startPos) {
  return this.getTokens(startPos).join('');
};

plex.UrlSquisher.RepLevel.prototype.remove = function(key) {
  this.map.delete(key);
  this.length--;
};

plex.UrlSquisher.RepLevel.prototype.removeUniques = function() {
  var keys = this.map.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (this.map.get(key).length < 2) {
      this.remove(key);
    }
  }
};

/**
 * If a pattern overlaps itself,
 * like "oxo" does inside "oxoxo",
 * and like "aa" does inside "aaa",
 * then delete the later of the two overlapping versions.
 * Don't delete non-overlapping ones of course.
 */
plex.UrlSquisher.RepLevel.prototype.removeSelfOverlaps = function() {
  var keys = this.map.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var vals = this.map.get(key);
    for (var j = 1; j < vals.length;) {
      var v0 = vals[j - 1];
      var v1 = vals[j];
      if (v1 - v0 >= this.chainLen) {
        j++;
      } else {
        vals.splice(j, 1);
      }
    }
    if (vals.length < 2) {
      this.remove(key);
    }
  }
};

plex.UrlSquisher.RepLevel.prototype.getAllStarts = function() {
  var a = {};
  var keys = this.map.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var list = this.map.get(key);
    for (var j = 0; j < list.length; j++) {
      a[list[j]] = true;
    }
  }
  return a;
};

