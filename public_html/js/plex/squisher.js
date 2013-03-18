this.plex = this.plex || {};

/**
 * Design:
 * https://docs.google.com/document/d/1i8on93dM2tW9qbkksPxlMbkTz2OO03_LPwf-ZDx2WvY/edit#heading=h.jbm9bg4rx28t
 * @constructor
 */
plex.Squisher = function(staticWords) {
  this.staticWords = staticWords || [];
};

/**
 * Commands indicating how the rest of the data is encoded.
 * "bytes" always means a string where every character represents one byte.
 * @enum {string}
 */
plex.Squisher.Encoding = {
  /** The rest is base64 encoded. */
  BASE64_BYTES: 'a',

  /** The rest is bytes representing an LZ-encoded bitstream. */
  LZ_BITSTREAM: 'z',

  /** The rest is static dictionary encoded bytes. */
  DICTIONARY: 'd',

  /** The rest is the original (percent-encoded to ASCII). */
  ORIGINAL: 'o'
};

/**
 * @param {String} original
 * @return {String} the squished string in base 64
 */
plex.Squisher.prototype.squish = function(original) {
  squished = plex.Squisher.Encoding.ORIGINAL + this.encodeToAscii(original);

  var newSquished = plex.Squisher.Encoding.DICTIONARY + this.compressWithStaticDictionary(squished);
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  var lz = new plex.LempelZiv(this.getAlphabet());
  newSquished = plex.Squisher.Encoding.LZ_BITSTREAM + lz.encodeToBytes(squished);
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  squished = plex.Squisher.Encoding.BASE64_BYTES + btoa(squished);
  return squished;
};

plex.Squisher.prototype.unsquish = function(str) {
  var command = str.charAt(0);
  str = str.substr(1);
  var next;
  if (command == plex.Squisher.Encoding.BASE64_BYTES) {
    next = atob(str);
  } else if (command == plex.Squisher.Encoding.LZ_BITSTREAM) {
    var lz = new plex.LempelZiv(this.getAlphabet());
    next = lz.decodeFromBytes(str);
  } else if (command == plex.Squisher.Encoding.DICTIONARY) {
    next = this.decompressWithStaticDictionary(str);
  } else if (command == plex.Squisher.Encoding.ORIGINAL) {
    str = decodeURI(str);
    // Done!
    return str;
  } else {
    throw Error('unknown command ' + command + ' for str ' + str);
  }
  // The recursion is nice because we'll get debuggable stackframes if there's a problem.
  return this.unsquish(next);
};

plex.Squisher.prototype.compressWithStaticDictionary = function(str) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    str = plex.string.replace(str, word, byteChar);
  }
  return str;
};

plex.Squisher.prototype.decompressWithStaticDictionary = function(str) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    str = plex.string.replace(str, byteChar, word);
  }
  return str;
};

plex.Squisher.prototype.getAlphabet = function() {
  if (!this.alphabet) {
    this.initAlphabetAndDictionary()
  }
  return this.alphabet;
};

plex.Squisher.prototype.getDictionary = function() {
  if (!this.dictionary) {
    this.initAlphabetAndDictionary();
  }
  return this.dictionary;
};


/** all the non-control lower-ASCII chars, for starters */
plex.Squisher.BASE_ALPHABET = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

plex.Squisher.prototype.encodeToAscii = function(str) {
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var charCode = str.charCodeAt(i);
    if (c == '%' || charCode < 32 || charCode > 126) {
      out[i] = plex.url.percentEscapeCharacter(c);
    } else {
      out[i] = c;
    }
  }
  return out.join('');
};

/**
 * All dictionary words get URI encoded, because the whole string gets URI encoded as step 1.
 */
plex.Squisher.prototype.initAlphabetAndDictionary = function() {
  var builder = [];
  for (var i = 32; i <= 126; i++) {
    builder.push(String.fromCharCode(i));
  }
  this.alphabet = plex.Squisher.BASE_ALPHABET;

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
    this.dictionary.push([byteChar, this.encodeToAscii(word)]);
    this.alphabet += byteChar;
    nextNum--;
  }
};
