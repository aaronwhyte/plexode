/**
 * @constructor
 */
function UrlSquisher() {
}

UrlSquisher.prototype.squish = function(url) {
  var t0 = (new Date()).getTime();
  var squished = "~" + url;
  var availableChars = this.getAvailableChars(url);
  console.log(availableChars);
  for (var subChar in availableChars) {
    var levels = this.calcAllLevels(squished);
    var original = this.calcBestOriginal(levels, subChar);
    if (!original) break;
    var prevLen = squished.length;
    squished = this.encodeReplacement(subChar, original, squished);
    console.log([prevLen - squished.length, subChar, original].join(' '));
  }
  var t1 = (new Date()).getTime();

  squished = "http://plexode.com/s#" + squished;
  console.log('ORIGINAL ------------------------');
  console.log(url);
  console.log('SQUISHED ------------------------');
  console.log(squished);
  console.log("original len: " + url.length);
  console.log("squished len: " + squished.length);
  console.log("compression ratio (less is better): " + (squished.length / url.length));
  console.log("time (ms): " + (t1 - t0));
};

UrlSquisher.prototype.unsquish = function(squished) {
  var index = 0;
  var body = null;
  var subs = [];
  // The 'while' condition is just to prevent an infinite loop for bad input.
  while (index < squished.length) {
    var c = squished.charAt(index);
    if (c == "~") {
      // The rest is the body.
      body = squished.substr(index + 1);
      break;
    }
    var bits = plex.url.URI_CHARS.indexOf(c);
    var origLen = Math.floor(bits / 4) + 1;
    var subLen = (bits & 3) + 1;
    index++;
    var sub = squished.substr(index, subLen);
    index += subLen;
    var original = squished.substr(index, origLen);
    index += origLen;
    subs.push({
      'sub': sub,
      'original': original
    });
  }
  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i];
    body = body.replace(new RegExp(plex.string.textToRegExpStr(sub.sub), "g"),
        sub.original);
  }
  return body;
};

/**
 * Figure out what one-character codes are unused.
 */
UrlSquisher.prototype.getAvailableChars = function(url) {
  var chars = plex.url.createUriCharSet();
  for (var i = 0; i < url.length; i++) {
    delete chars[url.charAt(i)];
  }
  return chars;
};

UrlSquisher.prototype.dumpLevels = function(levels) {
  console.log("=== dumpLevels === ");
  for (var i = 1; i < levels.length; i++) {
    var level = levels[i];
    for (var key in level.map) {
      console.log(key + " * " + level.map[key].length);
    }
  }
};

UrlSquisher.prototype.calcAllLevels = function(input) {
  var tokens = plex.url.tokenizeEncodedUrl(input);
  var levels = [];

  levels[1] = new UrlSquisher.RepLevel(tokens, 1);

  // For each token, remember where it appears.
  for (var i = 0; i < tokens.length; i++) {
    levels[1].add(i);
  }
  levels[1].removeUniques();

  var i = 2;
  while (true) {
    levels[i] = new UrlSquisher.RepLevel(tokens, i);
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


UrlSquisher.prototype.calcBestOriginal = function(levels, replacement) {
  // Now evaluate all the subs and pull out the best one.
  function calcBenefit(originalLength, substitutionLength, frequency) {
    return originalLength * (frequency - 1) - substitutionLength * (frequency + 1) - 1;
  }
  var bestOriginal = null;
  var bestBenefit = 0;
  for (var i = 1; i < levels.length; i++) {
    var level = levels[i];
    for (var key in level.map) {
      var benefit = calcBenefit(key.length, replacement.length, level.map[key].length);
      if (benefit > bestBenefit) {
        bestOriginal = key;
        bestBenefit = benefit;
      }
    }
  }
  return bestOriginal;
};

UrlSquisher.prototype.encodeReplacement = function(subChar, original, body) {
  var subLen = subChar.length;
  var origLen = original.length;
  if (subLen > 4 || origLen > 16) {
    throw Error("Oh no! subLen > 4 || origLen > 16: " +
        [subChar, original]);
  }
  body = body.replace(
        new RegExp(plex.string.textToRegExpStr(original), "g"),
        subChar);
    // 6 bit number, encoded in base-82, a single URL-legal char.
    // low 2 bits represent 1-4.
    // next 4 bits represent 1-16.
    var lenBits = (subLen - 1) + 4 * (origLen - 1);
    var command = plex.url.URI_CHARS.charAt(lenBits) +
        subChar + original;
  return command + body;
};

// next up:
// v Rename "squish" to something else, like "getNextSub"
//   and make it pick the best single substitution.
// v Write a function to take a string and a sub and encode it.
// v Then call them in a loop, starting with the string "~" + url,
//   until there are no sub strings left, or there are no good subs left.
// Then make the decoder work iteratively, too.
// Then test it.
// Then productize.
// FYI this looks a lot like Lempel-Ziv. http://www.data-compression.com/lossless.shtml#lz

/**
 * Tracks all repeat occurences of chains of tokens.
 * All chains in one RepLevel are of the same length.
 * @param tokens  the array of tokens
 * @param chainLen  the length of the token chains at this level
 * @constructor
 */
UrlSquisher.RepLevel = function(tokens, chainLen) {
  this.tokens = tokens;
  this.chainLen = chainLen;

  // Each key is a token chain joined with empty string, like "abc%20123".
  // Each value is an array of starting points where the chain appears.
  this.map = {};
  this.length = 0;
};

/**
 * @param startPos
 */
UrlSquisher.RepLevel.prototype.add = function(startPos) {
  var key = this.getKey(startPos);
  if (key.length > 16) {
    // Do not add keys longer than 16 chars,
    // since we can't encode them.
    return;
  }
  var list = this.map[key];
  if (!list) {
    this.map[key] = list = [];
  }
  list.push(startPos);
  this.length++;
};

UrlSquisher.RepLevel.prototype.addFromPrevLevel = function(prevLevel) {
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
UrlSquisher.RepLevel.prototype.supercede = function(prevLevel) {
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
  for (var key in this.map) {
    var starts = this.map[key];
    var shortKeys = [
      prevLevel.getKey(starts[0]),
      prevLevel.getKey(starts[0] + 1)
    ];
    // Look each of the two prevLevel chains.
    // If one has the same count as the longer chain,
    // then it is safe to remove.
    for (var i = 0; i < 2; i++) {
      var shortKey = shortKeys[i];
      var shortStarts = prevLevel.map[shortKey];
      if (shortStarts) {
        if (shortStarts.length == starts.length) {
            //smallCoveredByBig(shortStarts, starts)) {
          prevLevel.remove(shortKey);
        }
      }
    }
  }
};

UrlSquisher.RepLevel.prototype.getTokens = function(startPos) {
  var a = [];
  for (var i = 0; i < this.chainLen; i++) {
    a.push(this.tokens[startPos + i]);
  }
  return a;
};

UrlSquisher.RepLevel.prototype.getKey = function(startPos) {
  return this.getTokens(startPos).join('');
};

UrlSquisher.RepLevel.prototype.remove = function(key) {
  delete this.map[key];
  this.length--;
};

UrlSquisher.RepLevel.prototype.removeUniques = function() {
  for (var key in this.map) {
    if (this.map[key].length < 2) {
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
UrlSquisher.RepLevel.prototype.removeSelfOverlaps = function() {
  for (var key in this.map) {
    var vals = this.map[key];
    for (var i = 1; i < vals.length;) {
      var v0 = vals[i - 1];
      var v1 = vals[i];
      if (v1 - v0 >= this.chainLen) {
        i++;
      } else {
        vals.splice(i, 1);
      }
    }
    if (vals.length < 2) {
      this.remove(key);
    }
  }
};

UrlSquisher.RepLevel.prototype.getAllStarts = function() {
  var a = {};
  for (var key in this.map) {
    var list = this.map[key];
    for (var i = 0; i < list.length; i++) {
      a[list[i]] = true;
    }
  }
  return a;
};