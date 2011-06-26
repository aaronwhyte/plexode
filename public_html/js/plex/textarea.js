// Copyright 2006 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview  Utilities for setting and getting HTML textarea selections.
 * Tested on Fx 1.5, IE 6, Safari 2.0.4.
 */
plex.textarea = {};

/**
 * Figures out the start and end of a text area's selected text,
 * or cursor position.
 * @param {Object} ta  the textarea whose selection you want.
 * @return {Object} of the form {start:2, end:4}  If start and end are the
 * same, then you've got a cursor position.  Null means we don't know how to
 * compute the selection for this browser.
 */
plex.textarea.getSelection = function(ta) {
  var count = 0;
  var sel = null;
  if (ta.setSelectionRange) {
    // Fx and Safari make it easy!
    sel = {start: ta.selectionStart, end: ta.selectionEnd};
  } else if (ta.createTextRange) {
    // IE makes it hard.  And all that "StartToStart" stuff is broken for me.
    // Do a binary search for the distance from the beginning of the selection
    // to the beginning of the text area. That distance is the selection 
    // start.  That plus the selection string length is the end.
    var docSel = document.selection.createRange();
    var len = docSel.text.length;
    var step = -(ta.value.length - len)/2;
    var dist = -1;
    while (1) {
      ++count;
      var dup = docSel.duplicate();
      dist += step;
      dup.moveStart('character', dist);
      var inTa = dup.parentElement() == ta;
      if (step < 0.5 && step > -0.5) break; // within rounding distance
      if (count > 100) break; // at 2 million chars, count is 37.
      if ((!inTa && step < 0) || (inTa && step > 0)) {
        // We just stepped past the correct distance,
        // so cut search step in half and reverse direction.
        step = -step / 2;
      }
    }
    var start = -Math.round(dist) - 1;
    // Now, since IE counts a char-move over a 2-char EOLN as one char,
    // we have to go through and add those \r's back in.  \Arrr!
    for (var i = 0; i < start; ++i) {
      if (ta.value.charAt(i) == '\r') {
        ++start;
      }
    }
    var end = start + len;
    sel = {start:start, end:end};
  }
  return sel;
};
  
  
/**
 * Sets the textarea's selection.  Set start and end to be the same to
 * set the cursor position.
 * @param {Object} ta the textarea
 * @param {Number} start the new selection starting position
 * @param {Number} end the new selection ending position
 */
plex.textarea.setSelection = function(ta, start, end) {
  if (ta.setSelectionRange) {
    ta.setSelectionRange(start, end);
    ta.focus();
  } else if (ta.createTextRange()) {
    var sel = ta.createTextRange();
    sel.collapse();
    sel.moveEnd('character', start);
    // My IE overshoots.  Adjust to get to the right target.
    // Maybe it'll undershoot some day, so allow that too.
    var tlen = ta.value.substring(0, start)/*.replace(/\r\n/, '\n')*/.length;
    var tries = 100;
    while (sel.text.length < tlen) {
      log('right');
      sel.moveEnd('character', 1);
      if (! --tries) break;
    }
    while (sel.text.length > tlen) {
      log('left');
      sel.moveEnd('character', -1);
      if (! --tries) break;
    }
    sel.collapse(false); // move start from 0 to end
    sel.select();
  }
};


/**
 * Determines which lines are covered by the selection.
 * @param {Object} ta  textarea
 * @return {Object} object of the form {start:{Number}, end:{Number}}
 */
plex.textarea.getSelectedLines = function(ta) {
  var sel = plex.textarea.getSelection(ta);
  var textBefore = ta.value.substring(0, sel.start);
  var start = (textBefore.match(/\n/g) || []).length;
  var selectedText = ta.value.substring(sel.start, sel.end);
  var end = (selectedText.match(/\n/g) || []).length + start;
  return {start:start, end:end};
};


/**
 * Determines the starting character position, in the textarea's 'value' string,
 * of a certain line.
 * @param {Object} ta  textarea
 * @param {Number} line  the zero-indexed line number to find
 * @return {Number}  The position of the start of the line.
 */
plex.textarea.getLineStart = function(ta, line) {
  var pos = 0;
  for (var i = 0; i < line; ++i) {
    // try larger IE eoln first.
    var nextEoln = ta.value.indexOf('\r\n', pos);
    if (nextEoln != -1) {
      pos = nextEoln + 2;
    } else {
      nextEoln = ta.value.indexOf('\n', pos);
      if (nextEoln != -1) {
        pos = nextEoln + 1;
      } else {
        return -1;
      }
    }
  }
  return pos;
};


/**
 * Determines the starting and ending character position, in the textarea's
 * 'value' string, of a certain line.
 * @param {Object} ta  textarea
 * @param {Number} line  the zero-indexed line number to find
 * @return {Object} object of the form {start:{Number}, end:{Number}}
 */
plex.textarea.getLineStartAndEnd = function(ta, line) {
  var start = plex.textarea.getLineStart(ta, line);
  var end = -1;
  if (start != -1) {
    var nextEoln = ta.value.indexOf('\r\n', start);
    if (nextEoln != -1) {
      end = nextEoln + 2;
    } else {
      nextEoln = ta.value.indexOf('\n', start);
      if (nextEoln != -1) {
        end = nextEoln + 1;
      } else {
        // no more eolns; select to end of value
        end = ta.value.length;
      }
    }
  }
  return {start:start, end:end}; 
};

/**
 * Replaces the current selection with the supplied text, and moves the cursor
 * to be after the injected text.
 * @param {Object} ta the textarea
 * @param {String} text
 */
plex.textarea.replaceSelection = function(ta, text) {
  plex.textarea.replacePrefix(ta, '', text);
};

/**
 * Replaces the current selection and the prefix before it with the supplied
 * text, and moves the cursor to be after the injected text.
 * @param {Object} ta the textarea
 * @param {String} prefix
 * @param {String} text
 */
plex.textarea.replacePrefix = function(ta, prefix, text) {
  var sel = plex.textarea.getSelection(ta);
  log('getSel = ' + plex.object.expose(sel));
  if (!sel) return;
  var val = ta.value;
  var preLen = prefix.length;
  if (sel.start >= preLen && sel.end <= val.length) {
    var scrollTop = ta.scrollTop;
    ta.value =
        val.substring(0, sel.start - preLen) +
        text +
        val.substring(sel.end, val.length);
    var newPos = sel.start - preLen + text.length;
    log('setSel to ' + newPos);
    plex.textarea.setSelection(ta, newPos, newPos);
    ta.scrollTop = scrollTop;
  }
};
