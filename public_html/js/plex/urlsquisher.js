this.plex = this.plex || {};

/**
 * Only used for unsquishing legacy UrlSqisher-squished URLs.
 * Deprecated in favor of the vastly superior plex.Squisher.
 * @constructor
 */
plex.UrlSquisher = function() {
  this.legalChars = plex.url.TOTES_SAFE_HASH_CHARS;
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

plex.UrlSquisher.prototype.checkSubLens = function(subLen, origLen) {
  if (Math.floor(subLen) != subLen || subLen < 1 || subLen > 4) {
    throw Error("Illegal subLen " + subLen);
  }
  if (Math.floor(origLen) != origLen || origLen < 1 || origLen > 16) {
    throw Error("Illegal origLen " + origLen);
  }
};

plex.UrlSquisher.prototype.decodeLenChar = function(c) {
  var bits = this.legalChars.indexOf(c);
  if (bits < 0) throw Error("Invalid bits char '" + c + "'");
  var subLen = (bits & 3) + 1;
  var origLen = Math.floor(bits / 4) + 1;
  this.checkSubLens(subLen, origLen);
  return {subLen: subLen, origLen: origLen};
};
