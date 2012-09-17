// Copyright 2009 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

plex.url = {};

/**
 * Replaces the hash fragment with the string.  Does not encode.  Falsy values
 * are converted to empty-string.
 */
plex.url.setFragment = function(val) {
  // Just setting the location.hash to the val fails to encode newlines in
  // Safari, so we replace the whole URL.
  // Also, setting the hash to empty-string removes the '#', causing a reload,
  // so always add the #.
  var href = location.href;
  var hashIndex = href.indexOf("#");
  var nonHash = hashIndex < 0 ? href : href.substr(0, hashIndex);
  location.replace(nonHash + "#" + val);
};

/**
 * Gets the encoded URL fragment, not including the leading "#".  Does not
 * decode.  If there's no fragment, returns emptystring.
 */
plex.url.getFragment = function() {
  var hashIndex = window.location.href.indexOf("#");
  if (hashIndex == -1) return '';
  return window.location.href.substr(hashIndex + 1);
};

plex.url.encodeQuery = function(map) {
  var q = [];
  for (var key in map) {
    q.push(encodeURIComponent(key) + '=' +
        encodeURIComponent(map[key]));
  }
  return q.join('&');
};

plex.url.decodeQuery = function(queryString) {
  var map = {};
  var pairs = queryString.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    var val = decodeURIComponent(pair[1]);
    map[key] = val;
  }
  return map;
};

plex.url.getQuery = function() {
  var s = window.location.search;
  if (!s) return '';
  return s.substr(1)
};

plex.url.URI_CHARS =             "!#$&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_abcdefghijklmnopqrstuvwxyz~";
plex.url.LEGAL_HASH_CHARS =      "!$&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
plex.url.URI_COMPONENT_CHARS =   "!'()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
// Firefox incorrectly percent-escapes single-quotes when you do window.location.href.
plex.url.TOTES_SAFE_HASH_CHARS = "!()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";

/**
 * Splits a percent-encoded UTF-8-encoded URL into strings representing
 * individual Unicode code points.
 * This method does not check to make sure that the input was properly
 * encoded in the first place, but it will throw exceptions if it cannot
 * decode the bits of a percent-encoded codepoint.
 * See http://en.wikipedia.org/wiki/UTF-8#Description.
 * @param url The encoded URL to tokenize
 * @return {Array} Array of strings where each element represents
 * one percent-encoded UTF-8 character.
 * So "a%20b" would become ["a", "%20", "b"],
 * and "c d" would still be["c", " ", "d"], because this function does not
 * make sure all chars that should have been encoded were actually encoded.
 */
plex.url.tokenizeEncodedUrl = function(url) {
  var tokens = [];
  for (var i = 0; i < url.length;) {
    var c = url.charAt(i);
    if (c != "%") {
      tokens.push(c);
      i++;
      continue;
    }
    var bits = parseInt(url.substr(i + 1, 2), 16);
    var len;
    if ((0x80 & bits) == 0) {
      // 0xxxxxxx, so the byte represents a char in the 0-127 range.
      len = 3;
    } else if ((0xE0 & bits) == 0xC0) {
      // 110xxxxx
      len = 6;
    } else if ((0xF0 & bits) == 0xE0) {
      // 1110xxxx
      len = 9;
    } else if ((0xF8 & bits) == 0xF0) {
      // 11110xxx
      len = 12;
    } else if ((0xFC & bits) == 0xF8) {
      // 111110xx
      len = 15;
    } else if ((0xFE & bits) == 0xFC) {
      // 1111110x
      len = 18;
    } else {
      throw Error("error decoding bits " + Number(bits).toString(2));
    }
    tokens.push(url.substr(i, len));
    i += len;
  }
  // check our work...
  if (url != tokens.join('')) {
    throw Error('original URL\n' + url +
        '\n!= joined tokens\n' + tokens.join(''));
  }
  return tokens;
};
