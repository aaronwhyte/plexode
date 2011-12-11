/**
 * @constructor
 */
function LevelBuilder() {
  this.stack = [];
  this.transX = 0;
  this.transY = 0;
  this.s = 1;
  this.marks = [];
  this.prefabs = [];
  this.d = null; // direction, cardinal-directional-facing objects like buttons
  
  // bounding rect
  this.x0 = Infinity;
  this.y0 = Infinity;
  this.x1 = -Infinity;
  this.y1 = -Infinity;
}

LevelBuilder.prototype.save = function() {
  this.stack.push({
    transX: this.transX,
    transY: this.transY,
    scale: this.s
  });
};

LevelBuilder.prototype.restore = function() {
  var top = this.stack[this.stack.length - 1];
  this.stack.length--;
  this.transX = top.transX;
  this.transY = top.transY;
  this.s = top.scale;
};

LevelBuilder.prototype.translate = function(x, y) {
  this.transX += x * this.s;
  this.transY += y * this.s;
};

LevelBuilder.prototype.scale = function(s) {
  this.s = s;
};

LevelBuilder.prototype.mark = function(varargs) {
  for (var i = 0, n = arguments.length; i < n; i += 2) {
    var x = this.transX + this.s * arguments[i];
    var y = this.transY + this.s * arguments[i + 1];
    this.pushMark(x, y);
  }
  return this;
};

LevelBuilder.prototype.markX = function(x) {
  if (!this.marks.length) throw Error('There are not any marks yet');
  var prev = this.marks[this.marks.length - 1];
  this.pushMark(
      this.transX + this.s * x,
      prev.y);
  return this;
};

LevelBuilder.prototype.markY = function(y) {
  if (!this.marks.length) throw Error('There are not any marks yet');
  var prev = this.marks[this.marks.length - 1];
  this.pushMark(
      prev.x,
      this.transY + this.s * y);
  return this;
};

LevelBuilder.prototype.dir = function(d) {
  this.d = d;
  return this;
};

LevelBuilder.prototype.wall = function() {
  if (this.marks.length == 0) throw Error('There are not any marks yet');
  if (this.marks.length == 1) {
    var m = this.marks[0];
    return this.addPrefab(new WallPrefab(m.x, m.y, m.x, m.y));
  } else {
    // two or more walls, chained together
    var prev = this.marks[0];
    for (var i = 1; i < this.marks.length; i++) {
      var m = this.marks[i];
      this.prefabs.push(new WallPrefab(prev.x, prev.y, m.x, m.y));
      prev = m;
    }
    this.clearMarks();
  }
};

LevelBuilder.prototype.portals = function() {
  this.assertMarkCount(2);
  var a = this.marks[0];
  var b = this.marks[1];
  return this.addPrefab(new PortalPairPrefab(a.x, a.y, b.x, b.y));
};

LevelBuilder.prototype.block = function(opt_size) {
  this.assertMarkCount(1);
  var a = this.marks[0];
  return this.addPrefab(new BlockPrefab(a.x, a.y, opt_size));
};

LevelBuilder.prototype.player = function() {
  this.assertMarkCount(1);
  var a = this.marks[0];
  return this.addPrefab(new PlayerPrefab(a.x, a.y));
};

LevelBuilder.prototype.exit = function(url) {
  this.assertMarkCount(1);
  var a = this.marks[0];
  return this.addPrefab(new ExitPrefab(a.x, a.y, url));
};

LevelBuilder.prototype.door = function(isClosed) {
  this.assertMarkCount(2);
  var a = this.marks[0];
  var b = this.marks[1];
  return this.addPrefab(new DoorPrefab(a.x, a.y, b.x, b.y, isClosed));
};

LevelBuilder.prototype.zapper = function(isActive) {
  this.assertMarkCount(2);
  var a = this.marks[0];
  var b = this.marks[1];
  return this.addPrefab(new ZapperPrefab(a.x, a.y, b.x, b.y, isActive));
};

LevelBuilder.prototype.beamSensor = function(handler) {
  this.assertMarkCount(2);
  var a = this.marks[0];
  var b = this.marks[1];
  return this.addPrefab(new BeamSensorPrefab(a.x, a.y, b.x, b.y, handler));
};

LevelBuilder.prototype.button = function(handler) {
  this.assertMarkCount(1);
  this.assertDirNotNull();
  var a = this.marks[0];
  return this.addPrefab(new ButtonPrefab(a.x, a.y, this.d, handler));
};

LevelBuilder.prototype.grip = function(handler) {
  this.assertMarkCount(1);
  this.assertDirNotNull();
  var a = this.marks[0];
  return this.addPrefab(new GripPrefab(a.x, a.y, this.d, handler));
};

LevelBuilder.prototype.timer = function(timeoutLength, onTimeout) {
  this.assertMarkCount(1);
  var a = this.marks[0];
  return this.addPrefab(new TimerPrefab(a.x, a.y, timeoutLength, onTimeout));
};

LevelBuilder.prototype.playerAssembler = function(opt_isEntrance) {
  this.assertMarkCount(1);
  this.assertDirNotNull();
  var a = this.marks[0];
  return this.addPrefab(
      new PlayerAssemblerPrefab(a.x, a.y, this.d, opt_isEntrance || false));
};

LevelBuilder.prototype.getPrefabs = function() {
  return this.prefabs;
};

LevelBuilder.prototype.addPrefab = function(prefab) {
  this.prefabs.push(prefab);
  this.clearMarks();
  return prefab;
};

/**
 * This gets the bounding rect, surounding all the marks.
 */
LevelBuilder.prototype.getBoundingRect = function(opt_fudgeFactor) {
  var ff = opt_fudgeFactor || Prefab.WALL_RADIUS;
  return {
    'x0': this.x0 - ff, 
    'y0': this.y0 - ff,
    'x1': this.x1 + ff,
    'y1': this.y1 + ff
  };
}

/**
 * @private
 */
LevelBuilder.prototype.assertMarkCount = function(count) {
  if (this.marks.length != count) {
    throw Error('Expected ' + count + ' marks.  Actual marks: ' +
        this.marks.length);
  }
};

/**
 * @private
 */
LevelBuilder.prototype.assertDirNotNull = function() {
  if (!this.d) {
    throw Error('dir is null');
  }
};

/**
 * @private
 */
LevelBuilder.prototype.clearMarks = function() {
  this.marks.length = 0;
  this.d = null;
};

/**
 * @private
 */
LevelBuilder.prototype.pushMark = function(x, y) {
  this.marks.push(new Vec2d(x, y));
  this.x0 = Math.min(this.x0, x);
  this.y0 = Math.min(this.y0, y);
  this.x1 = Math.max(this.x1, x);
  this.y1 = Math.max(this.y1, y);
};