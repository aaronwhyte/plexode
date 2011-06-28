// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview Parses JavaScript, at least enough to do autocomplete in eval.
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.js = plex.js || {};

plex.js.parser = {};


/**
 * @enum {Number} parser states
 * @private
 */
plex.js.parser.STATE = {
  ID: 1,
  SQSTR: 2, // single-quote string
  SQESC: 3, // escaped single-quote string character
  DQSTR: 4,
  DQESC: 5,
  SLASH: 6, // may start one of 2 comment styles
  SLASHCMT: 7,
  STARCMT: 8,
  CLOSESTAR: 9, // the star before the closing slash
  NUM: 10,
  LSQUAREB: 11, // left square-bracket
  RSQUAREB: 12,
  DOT: 13,
  WHITE: 14, // white-space
  OTHER: 15 // any character that we don't recognize
};

plex.js.parser.ID_REGEXP_ = /^[a-z_\$][a-z0-9_\$]+$/i;
plex.js.parser.ID_START_REGEXP_ = /[a-z_\$]/i;
plex.js.parser.ID_CONTINUE_REGEXP_ = /[a-z0-9_\$]/i;

plex.js.parser.isId = function(str) {
  return plex.js.parser.ID_REGEXP_.test(str);
};


/**
 * Creates tokens to cover the entire string.
 * All tokens are truncated by end-of-lines, except for slash-star comments,
 * and whitespace.
 * Even unterminated string constants are truncated.  Never produces parse
 * errors.
 * @param {String} str  the text to tokenize
 * @return {Array.<plex.js.Token>} list of tokens
 */
plex.js.parser.tokenize = function(str) {
  /**
   * Creates a token from 'start' to 'pos', using the current state,
   * and sets 'start' to 'pos'.
   * (Does nothing if pos is past the end of the string, or if start >= pos.)
   */
  function end() {
    if (pos > start && pos <= len) {
      var type = plex.js.parser.getToken(state);
      var newToken = new plex.js.Token(type, start, pos);
      tokens.push(newToken);
      start = pos;
    }
  }
  
  /**
   * Moves 'pos' forward one char.
   * @return {Boolean} true if 'pos' is in the string, or false if we've
   *     run out of characters.
   */
  function advance() {
    ++pos;
    if (pos < len) {
      c = str.charAt(pos);
      eoln = c == '\n' || c == '\r';
      return true;
    } else {
      return false;
    }
  }
  
  var S = plex.js.parser.STATE;
  var T = plex.js.token.TYPE;
  var len = str.length;
  var tokens = [];

  var start = 0;
  var pos = -1;
  var state = S.OTHER;
  var c, eoln;
  
  while (advance()) {
    var newState = 0;
    switch (state) {
      case S.ID:
        if (!plex.js.parser.ID_CONTINUE_REGEXP_.test(c)) {
          end();
        } else {
          newState = state;
        } 
        break;
      case S.SQSTR:
        if (c == '\'') {
          advance();
          end();
        } else if (eoln) {
          end();
        } else if (c == '\\') {
          newState = S.SQESC;
        } else {
          newState = state;
        }
        break;
      case S.SQESC:
        if (eoln) {
          end();
        } else {
          newState = S.SQSTR;
        }
        break;
      case S.DQSTR:
        if (c == '"') {
          advance();
          end();
        } else if (eoln) {
          end();
        } else if (c == '\\') {
          newState = S.DQESC;
        } else {
          newState = state;
        }
        break;
      case S.DQESC:
        if (eoln) {
          end();
        } else {
          newState = S.DQSTR;
        }
        break;
      case S.SLASH:
        if (c == '/') {
          newState = S.SLASHCMT;
        } else if (c == '*') {
          newState = S.STARCMT;
        }
        break;
      case S.SLASHCMT:
        if (eoln) {
          end();
        } else {
          newState = state;
        }
        break;
      case S.STARCMT:
        if (c == '*') {
          newState = S.CLOSESTAR;
        } else {
          newState = state;
        }
        break;
      case S.CLOSESTAR:
        if (c == '/') {
          advance();
          end();
        } else {
          newState = S.STARCMT;
        }
        break;
      case S.NUM:
        if (!/\d/.test(c)) {
          end();
        } else {
          newState = state;
        }
        break;
      case S.WHITE:
        if (!/\s/.test(c)) {
          end();
        } else {
          newState = state;
        }
        break;
      case S.LSQUAREB:
      case S.RSQUAREB:
      case S.DOT:
        end();
        break;
    }
    
    if (!newState) {
      // start a new state using only the current char
      switch (c) {
        case '\'':
          newState = S.SQSTR;
          break;
        case '"':
          newState = S.DQSTR;
          break;
        case '[':
          newState = S.LSQUAREB;
          break;
        case ']':
          newState = S.RSQUAREB;
          break;
        case '.':
          newState = S.DOT;
          break;
        case '/':
          newState = S.SLASH;
          break;
        default:
          // more complex pattern comparisons
          if (/\s/.test(c)) {
            newState = S.WHITE;
          } else if (plex.js.parser.ID_START_REGEXP_.test(c)) {
            newState = S.ID;
          } else if (/\d/.test(c)) {
            newState = S.NUM;
          } else {
            newState = S.OTHER;
          }
      }
      if (newState != S.OTHER) {
        end();
      }
    }
    state = newState;
  } // end while
  
  // out of chars - truncate current state
  end();
  return tokens;
};


/**
 * Gets the token type associated with a state.
 * @param {plex.js.parser.STATE} state
 * @return {plex.js.token.TYPE}
 * @private
 */
plex.js.parser.getToken = function(state) {
  var S = plex.js.parser.STATE;
  var T = plex.js.token.TYPE;
  switch (state) {
    case S.ID: return T.ID;
    case S.SQSTR:
    case S.SQESC: return T.SQSTR;
    case S.DQSTR:
    case S.DQESC: return T.DQSTR;
    case S.SLASH: return T.OTHER;
    case S.SLASHCMT:
    case S.STARCMT:
    case S.CLOSESTAR: return T.CMT;
    case S.NUM: return T.NUM;
    case S.LSQUAREB: return T.LSQUAREB;
    case S.RSQUAREB: return T.RSQUAREB;
    case S.DOT: return T.DOT;
    case S.WHITE: return T.WHITE;
    case S.OTHER: return T.OTHER;
    default: throw Error('unhandled state ' + state);
  }
};
