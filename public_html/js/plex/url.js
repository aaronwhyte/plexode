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
  // Safari, so we replace the whole URL with a manually generated string.
  // Also, setting the hash to empty-string removes the '#', causing a reload,
  // so always add the #.
  var href = [
    location.protocol,
    '//',
    location.hostname,
    location.port ? ':' + location.port : '',
    location.pathname,
    location.search,
    '#',
    val ? val : ''];
  location.replace(href.join(''));
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

plex.url.decodeQuery = function(q) {
  var map = {};
  var pairs = q.split('&');
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

plex.url.URI_CHARS = "!#$&'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
plex.url.URI_COMPONENT_CHARS = "!'()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";

plex.url.createUriCharSet = function() {
  var uriCharSet = {};
  for (var i = 0; i < plex.url.URI_CHARS.length; i++) {
    uriCharSet[plex.url.URI_CHARS.charAt(i)] = true;
  }
  return uriCharSet;
};

plex.url.tokenizeEncodedUrl = function(url) {
  var tokens = [];
  for (var i = 0; i < url.length;) {
    var c = url.charAt(i);
    if (c != "%") {
      tokens.push(c);
      i++;
      continue;
    }
    // Parse percent-encoded UTF-8-encoding.
    // See http://en.wikipedia.org/wiki/UTF-8#Description
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
  return tokens;
};

/**
 * @param url an already uriEncoded URL
 */
plex.url.squish = function(url) {
  function calcSquishBenefit(originalLength, substitutionLength, frequency) {
    return originalLength * (frequency - 1)
        - substitutionLength * (frequency + 1) - 1;
  }

  // Figure out what one-char codes are unused.
  var availableChars = plex.url.createUriCharSet();
  for (var i = 0; i < url.length; i++) {
    delete availableChars[url.charAt(i)];
  }

  // Tokenize so the %xx values used to define Unicode code points are
  // made into individual tokens.
  var tokens = plex.url.tokenizeEncodedUrl(url);
  // check our work...
  if (url != tokens.join('')) {
    throw Error('original URL\n' + url +
        '\n!= joined tokens\n' + tokens.join(''));
  }

  // Count mono-tokens and note positions.
  var tokenMap = {};
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var posList = tokenMap[token];
    if (!posList) {
      posList = tokenMap[token] = [];
    }
    posList.push(i);
  }

  // Make a sortable array of token/positionlist pairs.
  var sortedTokens = [];
  for (var token in tokenMap) {
    var posList = tokenMap[token];
    // Forget about unique tokens.
    if (posList.length > 1) {
      sortedTokens.push({
        'token' : token,
        'posList': posList,
        'squishBenefit': calcSquishBenefit(token.length, 1, posList.length)
      });
    }
  }
  // Sort by squish benefit (characters saved), descending
  sortedTokens.sort(function(a, b) {
    return b.squishBenefit - a.squishBenefit;
  });

  var subs = [];
  var tokenIndex = 0;
  for (var subChar in availableChars) {
    if (!sortedTokens[tokenIndex] ||
        sortedTokens[tokenIndex].squishBenefit < 1) {
      break;
    }
    subs.push({
      'subChar': subChar,
      'original': sortedTokens[tokenIndex].token
    });
    tokenIndex++;
  }

  // Encode squished URL
  var body = url;
  var commands = "";
  for (var i = subs.length - 1; i >= 0; i--) {
    var sub = subs[i];
    var subLen = sub.subChar.length;
    var origLen = sub.original.length;
    // Skip stuff we can't encode.
    if (subLen > 4 || origLen > 16) {
      console.log("Oh no! subLen > 4 || origLen > 16: " +
          [sub.subChar, sub.original]);
      continue;
    }
    body = body.replace(
        new RegExp(plex.string.textToRegExpStr(sub.original), "g"),
        sub.subChar);
    // 6 bit number, encoded in base-82, a single URL-legal char.
    // low 2 bits represent 1-4.
    // next 4 bits represent 1-16.
    var lenBits = (subLen - 1) + 4 * (origLen - 1);
    commands = plex.url.URI_CHARS.charAt(lenBits) +
        sub.subChar + sub.original + commands;
  }
  var squishedUrl = commands + '~' + body;
  //debugger;
  return squishedUrl;
};

plex.url.unsquish = function(squished) {
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
