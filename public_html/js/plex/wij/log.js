// Copyright 2007 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview  Taking a stab at widgets here...
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.wij = plex.wij || {};
plex.wij.log = {};

/**
 * @constructor
 */
plex.wij.Log = function(opt_size) {
  this.size = opt_size || 100;
  this.htmls = [];
  this.div = null;
  this.innerId = plex.ids.nextId();
  this.texts = [];
  this.doc = null;
  this.startTime = (new Date()).getTime();
};

plex.wij.Log.prototype.getDiv = function(opt_doc) {
  if (!this.div) {
    this.doc = opt_doc || document;
    this.div = plex.dom.ce('div', null, this.doc);
    var s = this.div.style;
    s.position = 'relative';
    s.height = '100%';
    s.overflow = 'hidden';
    this.div.innerHTML =
        '<div style="position:absolute; bottom:0px"' +
        ' id="' + this.innerId + '">' +
        '</div>';
    
  }
  return this.div;
};

plex.wij.Log.prototype.log = function(text, opt_color) {
  var html = [];
  html.push('<div class=plexLog' +
            (opt_color ? ' style="color:' + opt_color + '">' : '>'));
      
  var ms = (new Date()).getTime() - this.startTime;
  html.push('<span>' + ms + '</span> ');
  html.push(plex.string.textToHtml(text, true));
  html.push('</div>');
  this.htmls.push(html.join(''));
  if (this.htmls.length > this.size) {
    this.htmls.shift();
  }
  var div = plex.dom.gebi(this.innerId, this.doc);
  if (div) {
    div.innerHTML = this.htmls.join('');
  }
};