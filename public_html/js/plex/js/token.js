// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * JS parse tokens
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.js = plex.js || {};

plex.js.Token = function(type, start, end) {
  this.type = type;
  this.start = start;
  this.end = end;
};

plex.js.Token.prototype.equals = function(that) {
  return this.type == that.type &&
         this.start == that.start &&
         this.end == that.end;
};

plex.js.Token.prototype.toString = function() {
  return '{' + [this.type, this.start, this.end].join(', ') + '}';
};

plex.js.Token.prototype.toString = function() {
  return '{' + [this.type, this.start, this.end].join(', ') + '}';
};

plex.js.Token.prototype.getStr = function(jsText) {
  return jsText.substring(this.start, this.end);
};

plex.js.token = {
  TYPE: {
    ID: 1, // identifier, [_$a-zA-Z][_$a-zA-Z0-9]*
    SQSTR: 2, // ' string
    DQSTR: 3, // " string
    CMT: 4, // comment
    NUM: 5, // number.  Only handling non-negative base-10 integers
    WHITE: 6, // whitespace 
    DOT: 7, // .
    LSQUAREB: 8, // [
    RSQUAREB: 9, // ]
    OTHER: 10
  }
};