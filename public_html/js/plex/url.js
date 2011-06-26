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
