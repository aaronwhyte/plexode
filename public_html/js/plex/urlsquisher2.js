this.plex = this.plex || {};

/**
 * Design:
 * https://docs.google.com/document/d/1i8on93dM2tW9qbkksPxlMbkTz2OO03_LPwf-ZDx2WvY/edit#heading=h.jbm9bg4rx28t
 * @constructor
 */
plex.UrlSquisher2 = function(staticWords) {
  this.staticWords = staticWords || [];
};

/**
 * Commands indicating how the rest of the data is encoded.
 * "bytes" always means a string where every character represents one byte.
 * @enum {string}
 */
plex.UrlSquisher2.Encoding = {
  /** The rest is base64 encoded. */
  BASE64_BYTES: 'a',

  /** The rest is bytes representing an LZ-encoded bitstream. */
  LZ_BITSTREAM: 'z',

  /** The rest is dynamic dictionary encoded bytes. */
  BEST_SUB: 's',

  /** The rest is static dictionary encoded bytes. */
  DICTIONARY: 'd',

  /** The rest is the literal URL in chars. */
  URL: 'u'
};

/**
 * @param url
 * @return {String} the squished url in base 64, not including any unsquisher-url prefix
 */
plex.UrlSquisher2.prototype.squish = function(url) {
  function log(tag) {
    var diff = squished.length - newSquished.length;
    console.log(tag + ' ' + squished.length +
        ' -> ' + newSquished.length +
        ', saved ' + diff);
  }
  var squished = plex.UrlSquisher2.Encoding.URL + url;

  var newSquished = plex.UrlSquisher2.Encoding.DICTIONARY + this.compressWithStaticDictionary(squished);
//  log('static dict');
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

//  var subTimes = 0;
//  var bestSubInput = squished;
//  while (1) {
//    var bestSub = this.compressWithBestSub(bestSubInput);
//    if (!bestSub) break;
//    newSquished = plex.UrlSquisher2.Encoding.BEST_SUB + bestSub;
//    if (newSquished.length < bestSubInput.length) {
//      subTimes++;
//      bestSubInput = newSquished;
//      // and do it again
//    } else {
//      // Didn't make legit progress. Done.
//      break;
//    }
//  }
//  log('best sub x' + subTimes);
//  var bestSubSquished = newSquished;

  var lz = new plex.LempelZiv(this.getAlphabet());
  newSquished = plex.UrlSquisher2.Encoding.LZ_BITSTREAM + lz.encodeToBytes(squished);
//  log('LZ');
//  var lzSquished = newSquished;
//
//  if (lzSquished.length <= bestSubSquished.length) {
//    newSquished = lzSquished;
//  } else {
//    newSquished = bestSubSquished;
//  }
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  newSquished = plex.UrlSquisher2.Encoding.BASE64_BYTES + btoa(squished);
//  log('btoa');
  return newSquished;
};

plex.UrlSquisher2.prototype.unsquish = function(str) {
  var command = str.charAt(0);
  str = str.substr(1);
  var next;
  if (command == plex.UrlSquisher2.Encoding.BASE64_BYTES) {
    next = atob(str);
  } else if (command == plex.UrlSquisher2.Encoding.LZ_BITSTREAM) {
    var lz = new plex.LempelZiv(this.getAlphabet());
    next = lz.decodeFromBytes(str);
  } else if (command == plex.UrlSquisher2.Encoding.BEST_SUB) {
    next = this.decompressWithBestSub(str);
  } else if (command == plex.UrlSquisher2.Encoding.DICTIONARY) {
    next = this.decompressWithStaticDictionary(str);
  } else if (command == plex.UrlSquisher2.Encoding.URL) {
    // Done!
    return str;
  } else {
    throw Error('unknown command ' + command + ' for str ' + str);
  }
  // The recursion is nice because we'll get debuggable stackframes if there's a problem.
  return this.unsquish(next);
};

plex.UrlSquisher2.prototype.compressWithStaticDictionary = function(str) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    str = plex.string.replace(str, word, byteChar);
  }
  return str;
};

plex.UrlSquisher2.prototype.decompressWithStaticDictionary = function(str) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    str = plex.string.replace(str, byteChar, word);
  }
  return str;
};

plex.UrlSquisher2.prototype.getAlphabet = function() {
  if (!this.alphabet) {
    this.initAlphabetAndDictionary()
  }
  return this.alphabet;
};

plex.UrlSquisher2.prototype.getDictionary = function() {
  if (!this.dictionary) {
    this.initAlphabetAndDictionary()
  }
  return this.dictionary;
};

plex.UrlSquisher2.prototype.initAlphabetAndDictionary = function() {
  this.alphabet = plex.url.URI_CHARS + '%';
  this.dictionary = [];
  var nextNum = 255;
  for (var i = 0; i < this.staticWords.length; i++) {
    // Find an unused byte.
    var byteChar = String.fromCharCode(nextNum);
    while (nextNum > 1 && this.alphabet.indexOf(byteChar) != -1) {
      byteChar = String.fromCharCode(nextNum);
      nextNum--;
    }
    if (nextNum <= 1) {
      // no more unused bytes
      return;
    }
    var word = this.staticWords[i];
    word = plex.url.percentEncodeUnwhitelistedChars(word, plex.url.URI_CHARS);
    this.dictionary.push([byteChar, word]);
    this.alphabet += byteChar;
    nextNum--;
  }
};

/**
 * @param str
 * @return {String?} null or the squished string (without the encoding command)
 */
plex.UrlSquisher2.prototype.compressWithBestSub = function(str) {
  // Find an unused symbol in our alphabet.
  var marker = null;
//  for (var i = 0; i < this.alphabet.length; i++) {
//    var c = this.alphabet.charAt(i);
//    if (str.indexOf(c) < 0) {
//      marker = c;
//      break;
//    }
//  }
  for (var i = 1; i < 256; i++) {
    var c = String.fromCharCode(i);
    if (str.indexOf(c) < 0) {
      marker = c;
      break;
    }
  }
  if (!marker) {
    return null;
  }

  var seeker = new plex.DupeSeeker();
  var dupes = seeker.getDupes(str, 2);
  var keys = dupes.getKeys();
  var bestKey = null;
  var bestScore = 0;
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (k.length > 255) {
      // Trim insanely long substitutions down to usable size.
      // The limit is 255 because we encode the length of the original
      // in a single byte.
      k = k.substr(0, 255);
    }
    var positions = dupes.get(k);
    // A substitution costs a BEST_SUB token, a substitute byte, a length byte,
    // and the original string.
    // It gains us the original's length (minus one for the marker byte) times
    // the number of times the original appeared in the data.
    var positionCount = plex.object.length(positions);
    var score = -1 -1 -k.length + (k.length-1) * positionCount;
    if (score > bestScore) {
      bestScore = score;
      bestKey = k;
    }
  }
  if (!bestKey) {
//    console.log('There are no valuable substitutions to make.');
    return null;
  }
//  console.log('bestKey: ' + bestKey);

  // Perform the substitution and prepend the decoding info.
  var keyReplacedWithMarkers = plex.string.replace(str, bestKey, marker);
//  console.log(str, marker.charCodeAt(0), bestKey, keyReplacedWithMarkers);
  var retval = marker + String.fromCharCode(bestKey.length) + bestKey + keyReplacedWithMarkers;
  return retval;
};

plex.UrlSquisher2.prototype.decompressWithBestSub = function(str) {
//  console.log('decompressWithBestSub:str: ' + str);
  var marker = str.charAt(0);
  var origLen = str.charCodeAt(1);
  var orig = str.substr(2, origLen);
  var keyReplacedWithMarkers = str.substr(2 + origLen);
//  console.log('decompressWithBestSub', str, marker, origLen, orig, keyReplacedWithMarkers);
  return plex.string.replace(keyReplacedWithMarkers, marker, orig);
};
