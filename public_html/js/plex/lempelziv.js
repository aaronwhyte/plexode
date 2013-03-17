this.plex = this.plex || {};

/**
 * @param alphabet A string made of all the legal characters in the input.
 * @constructor
 */
plex.LempelZiv = function(alphabet) {
  this.alphabet = alphabet;
};

plex.LempelZiv.STOPCODE = 0;

/**
 * @param {string} str  A string made up only of what's in the alphabet.
 * @return {Array} An array of integers.
 */
plex.LempelZiv.prototype.encodeToIntegers = function(str) {
  if (str == '') {
    return [plex.LempelZiv.STOPCODE];
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
  result.push(plex.LempelZiv.STOPCODE);
  return result;
};

/**
 * @param {Array} ints  An array of integers.
 * @return {string} A string made up only of what's in the alphabet.
 */
plex.LempelZiv.prototype.decodeFromIntegers = function(ints) {
  if (ints.length == 1 && ints[0] == plex.LempelZiv.STOPCODE) {
    return '';
  }
  var entry = '';
  var dict = this.createDecodingDictionary();
  var w = dict.get(ints[0]);
  var result = w;

  for (var i = 1; i < ints.length; i++) {
    var k = ints[i];
    if (k == plex.LempelZiv.STOPCODE) {
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
    throw Error('k:' + k + ' but expected stop-code:' + plex.LempelZiv.STOPCODE);
  }
  return result;
};

plex.LempelZiv.prototype.encodeToBitQueue = function(str, opt_bitQueue) {
  var ints = this.encodeToIntegers(str);
  var bitQueue = opt_bitQueue || new plex.BitQueue();
  var highestValuePossible = this.createEncodingDictionary().length + 1; // +1 for stopcode
  for (var i = 0; i < ints.length; i++) {
    var bitsNeeded = Number(highestValuePossible).toString(2).length;
    bitQueue.enqueueNumber(ints[i], bitsNeeded);
    highestValuePossible++;
  }
  return bitQueue;
};

plex.LempelZiv.prototype.decodeFromBitQueue = function(bitQueue) {
  var highestValuePossible = this.createEncodingDictionary().length + 1; // +1 for stopcode
  var ints = [];
  var num = -1;
  while (num != plex.LempelZiv.STOPCODE) {
    var bitsNeeded = Number(highestValuePossible).toString(2).length;
    num = bitQueue.dequeueNumber(bitsNeeded);
    ints.push(num);
    highestValuePossible++;
  }
  return this.decodeFromIntegers(ints);
};

/**
 * @param str The string to encode.
 * @return {String} of chars whose charCodes are from 0-255
 */
plex.LempelZiv.prototype.encodeToBytes = function(str) {
  // make sure the input only uses the legal alphabet
  for (var i = 0; i < str.length; i++) {
    if (this.alphabet.indexOf(str.charAt(i)) == -1) {
      throw Error('char ' + str.charAt(i) + ' not in alphabet ' + this.alphabet);
    }
  }
  var q = this.encodeToBitQueue(str);
  return q.dequeueToBytesAndPadZerosRight();
};

/**
 * @param {String} bytes  String of chars whose charCodes are from 0-255
 * @return {String} the decoded string
 */
plex.LempelZiv.prototype.decodeFromBytes = function(bytes) {
  var q = new plex.BitQueue();
  q.enqueueBytes(bytes);
  return this.decodeFromBitQueue(q);
};

plex.LempelZiv.prototype.createEncodingDictionary = function() {
  var dict = new plex.Map();
  var nextKey = 1;
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(this.alphabet.charAt(i), nextKey++);
  }
  return dict;
};

plex.LempelZiv.prototype.createDecodingDictionary = function() {
  var dict = new plex.Map();
  var nextKey = 1;
  for (var i = 0; i < this.alphabet.length; i++) {
    dict.set(nextKey++, this.alphabet.charAt(i));
  }
  return dict;
};
