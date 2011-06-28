// Copyright 2007 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview Misc js property utilities
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.js = plex.js || {};

plex.js.props = {};

/**
 * Matches a chain of properties in the root object.  The last property
 * in the chain will be prefix-matched, and '' will match everything.
 * @param {Object} root  the object to start from.  Must not be null.
 * @param {Array} propChain  chain of property names from root
 * @param {Number} opt_maxResults  optional.  Must be one or more.
 * @return {Object} the matching property names, mapped to the objects,
 *     or an empty object if there are none, or if the property chain is broken.
 */
plex.js.props.getMatches = function(root, propChain, opt_maxResults) {
  // Example: Suppose we're looking for propChain ['foo', 'bar', 'm'].
  var node = root;
  for (var i = 0; i < propChain.length - 1; ++i) {
    var prop = propChain[i];
    node = node[prop];
    if (!node) {
      // The chain is broken.  root.foo or root.foo.bar don't exist.
      return {};
    }
  }
  var matches = {};
  var count = 0;
  var prefix = propChain[propChain.length - 1];
  for (var name in node) {
    if (!prefix || name.indexOf(prefix) == 0) {
      try {
        matches[name] = node[name];
        if (++count >= opt_maxResults) break;
      } catch (e) {
        // ignore - netscape access problem wih window.document.???
      }
    }
  }
  return matches;
};


/**
 * Formats a chain of property dereferences, as JS code.
 * <p>
 * <code>plex.js.props.formatchain('window', ['document', 'body'])</code>
 * will return <tt>"document.body"</tt>
 * <p>
 * <code>plex.js.props.formatchain('window', ['my prop', 'f_x' '2b'])</code>
 * will return <tt>"window['my prop'].f_x['2b']"</tt>
 * @param {String} globalName  the name of the global context, like 'window'.
 *     Used when the first property must be represented with square-bracket
 *     notation.
 * @param {Array.<String>} chain  the list of property names to be dereferenced
 * @return {String} the JS code to dereference the chain,
 *     <strong>not</strong> HTML-escaped.
 */
plex.js.props.formatChain = function(globalName, chain) {
  var result = [];
  for (var i = 0; i < chain.length; ++i) {
    var name = chain[i];
    if (plex.js.parser.isId(name)) {
      // Use dot notation for names like identifiers.
      result.push((i ? '.' : '') + name);
    } else {
      // Use square-bracked notation for non-identifier names.
      result.push((i ? '' : globalName) + '[\'' +
                  plex.string.textToSingleQuoteJsLiteral(name) + '\']');
    }
  }
  return result.join('');
};


/**
 *
 * @param {Object} jsContext
 * @param {String} jsText
 * @return {Object} {values:map of string completions to objects, prefix:prefix}
 */
plex.js.props.getCompletions = function(jsContext, jsText) {
  var tokens = plex.js.parser.tokenize(jsText);
  var propChain = plex.js.props.getPropertyChain(jsText, tokens);
  var matches = 
      propChain.length ? plex.js.props.getMatches(jsContext, propChain) : {};
  var prefix = propChain.length ? propChain[propChain.length - 1] : '';
  return {
    matches: matches,
    prefix: prefix
  };
};


/**
 * @param {String} jsText
 * @param {Array} tokens
 * @return {Array.String} property chain
 */
plex.js.props.getPropertyChain = function(jsText, tokens) {
  if (!tokens.length) return [];
  var T = plex.js.token.TYPE;
  var chain = []; // Push IDs we find, and reverse the order before returning.
  var rightGoodTok = null;
  var leftTok = null;
  var endsWithDot = false;
  for (var i = tokens.length - 1; i >= 0; --i) {
    leftTok = tokens[i];
    if (rightGoodTok == null) {
      // look for a dot with optional comments/whitespace, or an ID
      switch (leftTok.type) {
        case T.ID:
          if (i == tokens.length - 1) {
            // the ID is the rightmost token
            chain.push(leftTok.getStr(jsText));
            rightGoodTok = leftTok;
          } else {
            i = 0;
          }
          break;
        case T.DOT:
          rightGoodTok = leftTok;
          endsWithDot = true;
          break;
        case T.CMT:
        case T.WHITE:
          break;
        default:
          i = 0;
      }
    } else if (rightGoodTok.type == T.DOT) {
      // look for ID
      switch (leftTok.type) {
        case T.ID:
          chain.push(leftTok.getStr(jsText));
          rightGoodTok = leftTok;
          break;
        case T.CMT:
        case T.WHITE:
          break;
        default:
          i = 0;
      }
    } else if (rightGoodTok.type == T.ID) {
      // look for dot
      switch (leftTok.type) {
        case T.DOT:
          rightGoodTok = leftTok;
          break;
        case T.CMT:
        case T.WHITE:
          break;
        default:
          i = 0;
      }
    }
  }
  chain = chain.reverse();
  if (chain.length && endsWithDot) {
    chain.push('');
  }
  return chain;
};
