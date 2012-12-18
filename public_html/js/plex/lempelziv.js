this.plex = this.plex || {};

/**
 * @param alphabet A string made of all the legal characters in the input.
 * @constructor
 */
plex.LempelZiv = function(alphabet) {
  this.alphabet = alphabet;
};

/**
 * @param {string} str  A string made up only of what's in the alphabet.
 * @return {Array} An array of integers.
 */
plex.LempelZiv.prototype.encodeToIntegers = function(str) {
  var w = '';
  var result = [];
  var dict = this.createEncodingDictionary();
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var wc = w + c;
    if (dict.contains(wc)) {
      w = wc;
    } else {
      result.push(dict.get(w));
      dict.set(wc, dict.length);
      w = String(c);
    }
  }

  // Output the last code.
  if (w !== "") {
    result.push(dict.get(w));
  }
  return result;
};

/**
 * @param {Array} ints  An array of integers.
 * @return {string} A string made up only of what's in the alphabet.
 */
plex.LempelZiv.prototype.decodeFromIntegers = function(ints) {
  var entry = '';
  var dict = this.createDecodingDictionary();
  var w = dict.get(ints[0]);
  var result = w;

  for (var i = 1; i < ints.length; i += 1) {
    var k = ints[i];
    if (dict.contains(k)) {
      entry = dict.get(k);
    } else {
      if (k === dict.length) {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }
    result += entry;

    // Add w+entry[0] to the dictionary.
    dict.set(dict.length, w + entry.charAt(0));

    w = entry;
  }
  return result;

};

plex.LempelZiv.prototype.createEncodingDictionary = function() {
  var dict = new plex.Map();
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(this.alphabet.charAt(i), i);
  }
  return dict;
};

plex.LempelZiv.prototype.createDecodingDictionary = function() {
  var dict = new plex.Map();
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(i, this.alphabet.charAt(i));
  }
  return dict;
};
