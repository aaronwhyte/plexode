this.plex = this.plex || {};

/**
 * @constructor
 */
plex.UrlSquisher2 = function(subWords) {
  this.subWords = subWords;
};

plex.UrlSquisher2.prototype.squishToBase64 = function(url) {
  url = this.compressWithDictionary(url);
  var lz = new plex.LempelZiv(this.getAlphabet());
  var bytes = lz.encodeToBytes(url);
  return btoa(bytes);
};

plex.UrlSquisher2.prototype.unsquishFromBase64 = function(base64) {
  var bytes = atob(base64);
  var lz = new plex.LempelZiv(this.getAlphabet());
  var url = lz.decodeFromBytes(bytes);
  url = this.decompressWithDictionary(url);
  return url;
};

plex.UrlSquisher2.prototype.compressWithDictionary = function(url) {
  var dict = this.getDictionary();
  for (var i = 0; i < dict.length; i++) {
    var entry = dict[i];
    var byteChar = entry[0];
    var word = entry[1];
    url = plex.string.replace(url, word, byteChar);
  }
  return url;
};

plex.UrlSquisher2.prototype.decompressWithDictionary = function(url) {
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
  for (var i = 0; i < this.subWords.length; i++) {
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
    var word = this.subWords[i];
    word = plex.url.percentEncodeUnwhitelistedChars(word, plex.url.URI_CHARS);
    this.dictionary.push([byteChar, word]);
    this.alphabet += byteChar;
    nextNum--;
  }
};
