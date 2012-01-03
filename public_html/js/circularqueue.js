/**
 * A circular buffer, backed by an array.
 * 
 * @param {number} maxLen  Must be one or more.
 * @constructor
 */
function CircularQueue(maxLen) {
  if (maxLen < 1) {
    throw new Error('maxlen must be at least one, but it was ' + maxLen);
  }
  this.maxLen = maxLen;
  this.a = [];
  this.head = this.tail = -1;
}

/**
 * @return {boolean}
 */
CircularQueue.prototype.isEmpty = function() {
  return this.head == -1;
};

/**
 * @return {boolean}
 */
CircularQueue.prototype.isFull = function() {
  if (this.head == -1) return false;
  var nextHead = this.head + 1;
  if (nextHead >= this.maxLen) {
    nextHead = 0;
  }
  return nextHead == this.tail;
};

/**
 * Adds an item to the head of the queue.
 * If the queue is full, an item is dropped from the tail.
 * @param val  Any value, to be enqueued.
 */
CircularQueue.prototype.enqueue = function(val) {
  if (this.head == -1) {
    // was empty
    this.head = this.tail = 0;
  } else {
    this.head++;
    if (this.head >= this.maxLen) {
      this.head = 0;
    }
    if (this.head == this.tail) {
      this.tail++;
      if (this.tail >= this.maxLen) {
        this.tail = 0;
      }
    }
  }
  this.a[this.head] = val;
};


/**
 * @return Whatever was pulled off the tail of the queue, or null if the queue is empty.
 */
CircularQueue.prototype.dequeue = function() {
  if (this.tail == -1) {
    // empty
    return null;
  }
  var val = this.a[this.tail];
  if (this.tail == this.head) {
    // now it's empty
    this.head = this.tail = -1;
  } else {
    // move tail fwd
    this.tail++;
    if (this.tail >= this.maxLen) {
      this.tail = 0;
    }
  }
  return val;
};


/**
 * @return {number} number of elements in the queue, between 0 and maxLength
 */
CircularQueue.prototype.size = function() {
  if (this.tail == -1) {
    // empty
    return 0;
  }
  var size = 1 + this.head - this.tail;
  if (size <= 0) {
    size += this.maxLen;
  }
  return size;
};


/**
 * @param {number} index gets the nth index from the tail.  Does not dequeue.
 */
CircularQueue.prototype.getFromTail = function(index) {
  if (index < 0) {
    throw new Error("index " + index + " < 0");
  }
  if (index >= this.size()) {
    throw new Error("index " + index + " is greater than size " + this.size());
  }
  var i = index + this.tail;
  if (i >= this.maxLen) {
    // wrap around
    i -= this.maxLen;
  }
  return this.a[i];
};

/**
 * @param {number} index gets the nth index from the head.  Does not dequeue.
 */
CircularQueue.prototype.getFromHead = function(index) {
  if (index < 0) {
    throw new Error("index " + index + " < 0");
  }
  if (index >= this.size()) {
    throw new Error("index " + index + " is greater than size " + this.size());
  }
  var i = this.head - index;
  if (i < 0) {
    // wrap around
    i += this.maxLen;
  }
  return this.a[i];
};
