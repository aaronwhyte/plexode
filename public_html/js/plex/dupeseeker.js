this.plex = this.plex || {};

plex.DupeSeeker = function() {
};

/**
 * @param {String} originalStr
 * @param {number} minStrLen
 * @return {plex.Map} a map from dupe string to positions it appears
 */
plex.DupeSeeker.prototype.getDupes = function(originalStr, minStrLen) {
  var charLocs = {};
  // Use this to ensure that we process strings in order of lowest-starting-index.
  // Skipping around would create mementos for suffixes of unprocessed strings,
  // preventing us from processing every dupe string along its full length.
  var charsOrderedByFirstIndex = [];
  for (var i = 0; i < originalStr.length; i++) {
    var c = originalStr.charAt(i);
    if (!charLocs[c]) {
      charLocs[c] = [];
      charsOrderedByFirstIndex.push(c);
    }
    charLocs[c].push(i);
  }
  var results = new plex.Map();
  var mementos = new plex.StringSet();
  for (var i = 0; i < charsOrderedByFirstIndex.length; i++) {
    var c = charsOrderedByFirstIndex[i];
    if (charLocs[c].length > 1) {
      // "c" is a non-unique starting char.
      if (minStrLen <= 1) {
        results.set(c, charLocs[c]);
      }
      this.seekLongerDupes(originalStr, charLocs[c], 1, minStrLen, results, mementos);
    }
  }
  return results;
};

/**
 * @param {String} originalStr The full original string
 * @param {Array} startLocs An array of indexes where the dupe string starts, in ascending order
 * @param {Number} subStrLength The length of the dupe string
 * @param {Number} minStrLen The shortest length string to include in the results
 * @param {plex.Map} results A place to accumulate results
 * @param {plex.StringSet} mementos Stringified arrays of positions that have already been processed
 */
plex.DupeSeeker.prototype.seekLongerDupes = function(
    originalStr, startLocs, subStrLength, minStrLen, results, mementos) {

  function createMemento(locs, offset) {
    var mem = [];
    for (var i = 0; i < locs.length; i++) {
      mem.push(locs[i] + offset);
    }
    return JSON.stringify(mem);
  }

  var nextLen = subStrLength + 1;

  // Don't process this set of strings if we've crossed them before.
  var mem = createMemento(startLocs, subStrLength);
  if (mementos.contains(mem)) {
    return;
  }

  var prevStr = originalStr.substr(startLocs[0], subStrLength);
  // Map all the next-longer strings to their starting positions.
  var nextLocs = {};
  for (var i = 0; i < startLocs.length; i++) {
    var startLoc = startLocs[i];
    var nextStr = originalStr.substr(startLoc, nextLen);
    if (!nextLocs[nextStr]) {
      nextLocs[nextStr] = [];
    }
    nextLocs[nextStr].push(startLoc);
  }

  // Find the non-overlapping non-unique ones.
  for (var nextStr in nextLocs) {
    var goodLocs = [];
    var locs = nextLocs[nextStr];
    var prevStart = -Infinity;

    // Accumulate the non-overlapping goodLocs.
    for (var i = 0; i < locs.length; i++) {
      var loc = locs[i];
      if (loc >= prevStart + nextLen) {
        goodLocs.push(loc);
        prevStart = loc;
      }
    }

    if (subStrLength >= minStrLen && goodLocs.length < startLocs.length) {
      // There are more of prevStr than there there are of nextStr.
      // Record "prevStr" in results.
      results.set(prevStr, startLocs);
    }

    if (goodLocs.length > 1) {
      // "nextStr" is not unique, so process it and its descendants.
      this.seekLongerDupes(originalStr, goodLocs, nextLen, minStrLen, results, mementos);
      mementos.put(createMemento(goodLocs, subStrLength));
    }
  }
};
