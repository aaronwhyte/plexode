/**
 * @constructor
 */
function SparkList() {
  this.now = -1;
  this.sparks = [];
  this.size = 0;
  this.lastAdvanceTime = -1;
}

//////////////
// Abstract
//////////////

/**
 * @return a new Spark instance
 */
SparkList.prototype.alloc = function() {
  throw Error('Implement SparkList.alloc()');
};

/**
 * Copy the fields from src to dest, without any allocation
 */
SparkList.prototype.copy = function(src, dest) {
  throw Error('Implement SparkList.copy(src, dest)');
};

/**
 * @return {boolean} true if the spark will never be painted again,
 * and is ready to be recycled
 */
SparkList.prototype.isKaput = function(spark, now) {
  throw Error('Implement SparkList.isKaput(spark, now)');
};

/**
 * Override if the sparks have some behavior.
 */
SparkList.prototype.advanceSpark = function(spark, now) {
};

/**
 * Render the spark.
 */
SparkList.prototype.paint = function(renderer, spark, now) {
  throw Error('Implement paint(renderer, spark, now)');
};


////////////
// Public
////////////

/**
 * Adds a single spark.
 */
SparkList.prototype.add = function(src) {
  if (this.size >= this.sparks.length) {
    this.sparks[this.size] = this.alloc();
  }
  var dest = this.sparks[this.size];
  this.copy(src, dest);
  this.size++;
};

/**
 * Clears out the kaput sparks, and calls advanceSpark() on the rest
 */
SparkList.prototype.advance = function(now) {
  if (now == this.lastAdvanceTime) return;
  for (var i = 0; i < this.size; i++) {
    if (this.isKaput(this.sparks[i], now)) {
      if (i < this.size - 1) {
        this.copy(this.sparks[this.size - 1], this.sparks[i]);
      }
      this.size--;
      i--;
    }
  }
  for (var i = 0; i < this.size; i++) {
    this.advanceSpark(this.sparks[i], now);
  }
  this.lastAdvanceTime = now;
};

/**
 * Calls paint() for all the sparks.
 */
SparkList.prototype.paintAll = function(renderer, now) {
  for (var i = 0; i < this.size; i++) {
    this.paint(renderer, this.sparks[i], now);
  }
};

SparkList.prototype.isEmpty = function() {
  return this.size == 0;
};