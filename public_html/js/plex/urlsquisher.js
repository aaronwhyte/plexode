/**
 * @constructor
 */
function UrlSquisher() {
}

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

UrlSquisher.prototype.calcSquishBenefit = function(tokenChain, substitutionLength, frequency) {
  var originalLength = 0;
  for (var i = 0; i < tokenChain.length; i++) {
    originalLength += tokenChain[i].length;
  }
  return originalLength * (frequency - 1) - substitutionLength * (frequency + 1) - 1;
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
  console.log("dumpLevels");
  for (var i = 1; i < levels.length; i++) {
    console.log("--- level " + i + " ---");
    var level = levels[i];
    for (var key in level.map) {
      console.log(key + " * " + level.map[key].length);
    }
  }
};

UrlSquisher.prototype.squish = function(url) {
  var availableChars = this.getAvailableChars(url);
  var tokens = plex.url.tokenizeEncodedUrl(url);
  var levels = [];

  levels[1] = new UrlSquisher.RepLevel(tokens, 1);

  // For each token, remember where it appears.
  for (var i = 0; i < tokens.length; i++) {
    levels[1].add(i);
  }
  levels[1].removeUniques();

  i = 2;
  while (true) {
    levels[i] = new UrlSquisher.RepLevel(tokens, i);
    levels[i].addFromPrevLevel(levels[i - 1]);
    levels[i].removeUniques();
    if (levels[i].length == 0) {
      levels.pop();
      break;
    }
    levels[i].supercede(levels[i - 1]);
    i++;
  }
  this.dumpLevels(levels);



//  var subs = [];
//  var tokenIndex = 0;
//  for (var subChar in availableChars) {
//    if (!sortedTokens[tokenIndex] ||
//        sortedTokens[tokenIndex].squishBenefit < 1) {
//      break;
//    }
//    subs.push({
//      'subChar': subChar,
//      'original': sortedTokens[tokenIndex].token
//    });
//    tokenIndex++;
//  }

//  // Encode squished URL
//  var body = url;
//  var commands = "";
//  for (var i = subs.length - 1; i >= 0; i--) {
//    var sub = subs[i];
//    var subLen = sub.subChar.length;
//    var origLen = sub.original.length;
//    // Skip stuff we can't encode.
//    if (subLen > 4 || origLen > 16) {
//      console.log("Oh no! subLen > 4 || origLen > 16: " +
//          [sub.subChar, sub.original]);
//      continue;
//    }
//    body = body.replace(
//        new RegExp(plex.string.textToRegExpStr(sub.original), "g"),
//        sub.subChar);
//    // 6 bit number, encoded in base-82, a single URL-legal char.
//    // low 2 bits represent 1-4.
//    // next 4 bits represent 1-16.
//    var lenBits = (subLen - 1) + 4 * (origLen - 1);
//    commands = plex.url.URI_CHARS.charAt(lenBits) +
//        sub.subChar + sub.original + commands;
//  }
//  var squishedUrl = commands + '~' + body;
//  return squishedUrl;
};




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
  var starts = prevLevel.getSortedStarts();
  for (var i = 0; i < starts.length - 1; i++) {
    var startPos = starts[i];
    if (starts[i + 1] != startPos + 1) {
      // There are not two starting chains in a row of length chainLen - 1,
      // so there must not be a longer repeated chain of length chainLen here.
      continue;
    }
    this.add(startPos);
  }
};

/**
 * Alters the prevLevel like so:
 * For every repeated chain in this level,
 * if if covers all the instances of a repeated chain in the prevLevel,
 * then delete the repeated chain from the prevLevel.
 */
UrlSquisher.RepLevel.prototype.supercede = function(prevLevel) {
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
    // What if both short chains are equal, and there are n*2 of them?
    // Example, the new chain is "aaa" and the short ones are both "aa".
    if (shortKeys[0] &&
        shortKeys[0] == shortKeys[1] &&
        prevLevel.map[shortKeys[0]].length == 2 * starts.length) {
      prevLevel.remove(shortKeys[0]);
    } else {
      // Look at the two prevLevel chains.
      // If they have the same count as the longer chain,
      // then they're safe to remove.
      for (var i = 0; i < 2; i++) {
        var shortKey = shortKeys[i];
        var shortStarts = prevLevel.map[shortKey];
        if (shortStarts && shortStarts.length == starts.length) {
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


UrlSquisher.RepLevel.prototype.getSortedStarts = function() {
  var a = [];
  for (var key in this.map) {
    var list = this.map[key];
    for (var i = 0; i < list.length; i++) {
      a.push(Number(list[i]));
    }
  }
  return a.sort(function(a, b){
    return a - b
  });
};
