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
  DYNAMIC_DICTIONARY: 'd',

  /** The rest is static dictionary encoded bytes. */
  STATIC_DICTIONARY: 's',

  /** The rest is the literal URL in chars. */
  URL: 'u'
};

/**
 * @param url
 * @return {String} a squished, prefixed URL, or the original URL if squishing didn't really help.
 */
plex.UrlSquisher2.prototype.squish = function(url) {
  var squished = plex.UrlSquisher2.Encoding.URL + url;

  var newSquished = plex.UrlSquisher2.Encoding.STATIC_DICTIONARY + this.compressWithStaticDictionary(squished);
  console.log('static dict ' + squished.length + ' -> ' + newSquished.length);
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  var lz = new plex.LempelZiv(this.getAlphabet());
  newSquished = plex.UrlSquisher2.Encoding.LZ_BITSTREAM + lz.encodeToBytes(squished);
  console.log('LZ ' + squished.length + ' -> ' + newSquished.length);
  if (newSquished.length < squished.length) {
    squished = newSquished;
  }

  squished = plex.UrlSquisher2.Encoding.BASE64_BYTES + btoa(squished);

  return squished.length < url.length ? squished : url;
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
  } else if (command == plex.UrlSquisher2.Encoding.DYNAMIC_DICTIONARY) {
    // TODO
    throw Error('Dynamic dictionary decoding is not implemented yet.');
  } else if (command == plex.UrlSquisher2.Encoding.STATIC_DICTIONARY) {
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

plex.UrlSquisher2.prototype.compressWithStaticDictionary = function(url) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    url = plex.string.replace(url, word, byteChar);
  }
  return url;
};

plex.UrlSquisher2.prototype.decompressWithStaticDictionary = function(url) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    url = plex.string.replace(url, byteChar, word);
  }
  return url;
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
