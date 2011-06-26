// Copyright 2006 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview utility for serving unique ID numbers.  Kinda stupid.
 */
plex.ids = {};

plex.ids.num = 1;
plex.ids.PREFIX = 'plex';
plex.ids.regExp = RegExp('^' + plex.ids.PREFIX + '\\d+$');


plex.ids.getNum = function(id) {
  if (plex.ids.regExp.test(id)) {
    return Number(id.substring(plex.ids.PREFIX.length));
  }
  return null;
};


plex.ids.nextId = function() {
  return plex.ids.PREFIX + plex.ids.num++;
};


plex.ids.nextIds = function(count) {
  var retval = [];
  for (var i = 0; i < count; ++i) {
    retval[i] = plex.ids.PREFIX + plex.ids.num++;
  }
  return retval;
};
