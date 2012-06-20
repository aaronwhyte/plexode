// Copyright 2012 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

function unsquish() {
  var s = new plex.UrlSquisher();
  var f = plex.url.getFragment();
  var u = s.unsquish(f);
  window.location.replace(u);
}