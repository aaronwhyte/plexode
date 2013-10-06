// Copyright 2006 Aaron Whyte
// All Rights Reserved.

this.plex = this.plex || {};

/**
 * @fileoverview array math and utils
 */
plex.array = {};

/**
 * Finds the region of difference between arrays 'a' and 'b', using ===.
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Array} null if there's no diff, or an array of the form
 * <code>[start of diff, length of diff in 'a', length of diff in 'b']</code>
 * <br>
 * examples:<br>
 * arrayDiff([0, 11, 11, 0], [0, 22, 0]) returns [1, 2, 1]<br>
 */
plex.array.diff = function(a, b) {
  // find beginning of diff
  for (var i = 0; i < a.length || i < b.length; ++i) {
    if (a[i] !== b[i]) {
      // find lengths of diff
      var ai = a.length - 1;
      var bi = b.length - 1;
      while (ai >= i && bi >= i) {
        if (a[ai] !== b[bi]) {
          break;
        }
        --ai;
        --bi;
      }
      return [i, ai - i + 1, bi - i + 1];
    }
  }
  return null;
};

/**
 * Tests to see if two arrays are equal, using === on the items.  Tests
 * array lengths first for an easy fast fail.
 * @return {boolean} true iff they're equal.
 */
plex.array.equals = function(a, b) {
  if (a.length != b.length) {
    return false;
  }
  // same length; compare entries
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};


/**
 * Sorts a list by item length.  Good for strings or arrays.
 * Keeps the original list order, within each length-bucket.
 * @return a new sorted array
 */
plex.array.sortByLength = function(strs) {
  var buckets = [];
  for (var i = 0; i < strs.length; ++i) {
    var s = strs[i];
    var len = s.length;
    if (!buckets[len]) {
      buckets[len] = [];
    }
    buckets[len].push(s);
  }
  var retval = [];
  for (var b = 0; b < buckets.length; ++b) {
    if (buckets[b]) {
      retval = buckets[b].concat(retval);
    }
  }
  return retval;
};


/**
 * Gets the index of an element in an array, using ===.
 * @param {Array} a  the array in which to look
 * @param {Object} val  the value for which to look
 * @param {number=} opt_fromIndex  optional starting index.  Default is 0.
 * @return {number} the index of the val, or -1 if it's not in the array
 */
plex.array.indexOf = function(a, val, opt_fromIndex) {
  for (var i = opt_fromIndex || 0, n = a.length; i < n; ++i) {
    if (a[i] === val) {
      return i;
    }
  }
  return -1;
};


/**
 * Gets the index of an element in an array, using ===.
 * @param {Array} a  the array in which to look
 * @param {Object} val  the value for which to look
 * @return {boolean}
 */
plex.array.contains = function(a, val) {
  return plex.array.indexOf(a, val) !== -1;
};


/**
 * Makes a shallow copy of the array.
 * @param {Array} a  the array to copy
 * @return {Array} the new array
 */
plex.array.copy = function(a) {
  var b = [];
  for (var i = 0; i < a.length; ++i) {
    b[i] = a[i];
  }
  return b;
};

/**
 * Like Python, this adds all the elements in addMe to toMe.
 * Unlike Array.contat, this does not create a new array. This modifies toMe.
 * @param {Array} toMe
 * @param {Array} addMe
 * @return {Array} toMe after modification
 */
plex.array.extend = function(toMe, addMe) {
  for (var i = 0; i < addMe.length; i++) {
    toMe.push(addMe[i]);
  }
  return toMe;
};

///**
//* crazy HTML formatter for side-by-side array diffing.
//* @return a n HTML table with class 'diff' and with diffed regions as divs
//* also having class 'diff'
//* @deprecated
//*/
//formatDiff: function(a, b, diff) {
//var h = [];
//
//function pushDiffCell(c, length) {
// h.push('<td><div class="diff">');
// for (var i = diff[0]; i < diff[0] + length; ++i) {
//   if (c[i].toString() === "") {
//     // string is empty
//     h.push('&nbsp;<br>');
//   } else {
//     h.push(plex.textToHtml(c[i], true));
//     h.push('<br>');
//   }
// }
// h.push('</div></td>');
//}
//
//function pushSameCell(c, start, end) {
// h.push('<td>');
// for (var i = start; i < end; ++i) {
//   if (c[i].toString() === "") {
//     // string is empty or all spaces
//     h.push('&nbsp;<br>');
//   } else {
//     h.push(plex.textToHtml(c[i], true));
//     h.push('<br>');
//   }
// }
// //h.push(plex.textToHtml(c.slice(start, end).join('\n')));
// h.push('</td>');
//}
//
//h.push('<table class="diff" cellpadding=0 cellspacing=0>');
//
//// same region
//h.push('<tr>');
//pushSameCell(a, 0, diff[0]);
//pushSameCell(b, 0, diff[0]);
//h.push('</tr>');
//
//// diff region
//h.push('<tr>');
//pushDiffCell(a, diff[1]);
//pushDiffCell(b, diff[2]);
//h.push('</div></tr>');
//
//// same region
//h.push('<tr>');
//pushSameCell(a, diff[0] + diff[1], a.length);
//pushSameCell(b, diff[0] + diff[2], b.length);
//h.push('</tr>');
//
//h.push('</table>');
//return h.join('');
//},


