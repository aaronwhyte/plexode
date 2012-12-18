this.plex = this.plex || {};

/**
 * @param alphabet A string made of all the legal characters in the input.
 * @constructor
 */
plex.LempelZiv = function(alphabet) {
  this.alphabet = alphabet;
};

plex.LempelZiv.STOP = 0;

/**
 * @param {string} str  A string made up only of what's in the alphabet.
 * @return {Array} An array of integers.
 */
plex.LempelZiv.prototype.encodeToIntegers = function(str) {
  if (str == '') {
    return [plex.LempelZiv.STOP];
  }
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
      dict.set(wc, dict.length + 1);
      w = String(c);
    }
  }

  // Output the last code.
  if (w !== "") {
    result.push(dict.get(w));
  }
  result.push(plex.LempelZiv.STOP);
  return result;
};

/**
 * @param {Array} ints  An array of integers.
 * @return {string} A string made up only of what's in the alphabet.
 */
plex.LempelZiv.prototype.decodeFromIntegers = function(ints) {
  if (ints.length == 1 && ints[0] == plex.LempelZiv.STOP) {
    return '';
  }
  var entry = '';
  var dict = this.createDecodingDictionary();
  var w = dict.get(ints[0]);
  var result = w;

  for (var i = 1; i < ints.length; i++) {
    var k = ints[i];
    if (k == plex.LempelZiv.STOP) {
      break;
    }
    if (dict.contains(k)) {
      entry = dict.get(k);
    } else {
      if (k === dict.length + 1) {
        entry = w + w.charAt(0);
      } else {
        throw Error('could not decode integer ' + k);
      }
    }
    result += entry;

    // Add w+entry[0] to the dictionary.
    dict.set(dict.length + 1, w + entry.charAt(0));

    w = entry;
  }
  if (k != 0) {
    throw Error('k:' + k + ' but expected stop-code:' + plex.LempelZiv.STOP);
  }
  return result;

};

plex.LempelZiv.prototype.createEncodingDictionary = function() {
  var dict = new plex.Map();
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(this.alphabet.charAt(i), i + 1);
  }
  return dict;
};

plex.LempelZiv.prototype.createDecodingDictionary = function() {
  var dict = new plex.Map();
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(i + 1, this.alphabet.charAt(i));
  }
  return dict;
};
