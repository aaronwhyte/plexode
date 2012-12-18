this.plex = this.plex || {};

plex.BitQueue = function() {
  // Array of strings that we append to when writing, and that we
  // consolidate into a single string when reading.
  this.queue = [];
  this.nextReadPos = 0;
  this.length = 0;
};

/**
 * @param num
 * @param bitCount
 */
plex.BitQueue.prototype.enqueueNumber = function(num, bitCount) {
  // todo: trim the read part off the 0th element, and reset nextReadPos.
  var bitStr = Number(num).toString(2);
  if (bitStr.length > bitCount) {
    throw Error('number ' + num + ' has more bits than bitCount ' + bitCount);
  }
  this.queue.push(plex.string.padLeft(bitStr, '0', bitCount));
  this.length += bitCount;
};

/**
 * @param bitCount  the number of bits to consume to read a number.
 * @return {Number}
 */
plex.BitQueue.prototype.dequeueNumber = function(bitCount) {
  // Smush the queue into one string before reading.
  if (this.queue.length > 1) {
    this.queue[0] = this.queue.join('');
    this.queue.length = 1;
  }
  var queueStr = this.queue[0];
  var queueLen = queueStr.length - this.nextReadPos;
  if (bitCount > queueLen) {
    throw Error('bitCount ' + bitCount + ' > queueLen ' + queueLen);
  }
  var bitStr = queueStr.substr(this.nextReadPos, bitCount);
  var num = parseInt(bitStr, 2);
  this.nextReadPos += bitCount;
  this.length -= bitCount;
  return num;
};

plex.BitQueue.prototype.enqueueBytes = function(bytes) {
  for (var i = 0; i < bytes.length; i++) {
    this.enqueueNumber(bytes.charCodeAt(i), 8);
  }
};

plex.BitQueue.prototype.dequeueToBytesAndPadZerosRight = function() {
  var bytesArray = [];
  var tailLength = this.length % 8;
  if (tailLength) {
    this.enqueueNumber(0, 8 - tailLength);
  }
  while (this.length) {
    var num = this.dequeueNumber(8);
    bytesArray.push(String.fromCharCode(num));
  }
  return bytesArray.join('');
};