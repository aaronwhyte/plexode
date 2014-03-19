/**
 * @param {number} cellSize  max height and width for each cell in the
 * collider. The actual may be a little smaller.
 * @param groupPairs an array of 2-element arrays with group IDs.
 * This tells the collider to compare sledges in 2 groups for collisions.
 * The two IDs of a pair may be the same, to make
 * a group's sledges collide with each other.
 * @param {GameClock} clock
 * @constructor
 */
function CellCollider(cellSize, groupPairs, clock) {
  FLAGS && FLAGS.set('debugRayScans', false);

  this.cellSize = cellSize;
  this.groupPairs = groupPairs;
  this.clock = clock;

  this.marks = [];

  // Sledges by ID
  this.sledges = {};
  this.nextId = 1;

  // times when sledges cross into new cells
  this.cellEntries = new SkipQueue(200);

  // sledge-to-sledge hit objects
  this.hits = new SkipQueue(200);

  this.hitOut = Hit.alloc(0, 0, false, -1, -1);

  // The grid is a hash of column number (x) to columns,
  // and a columns is a hash from row (y) to a cell object.
  this.grid = {};
}

/**
 * Sledge radius padding, for deciding which cells a sledge occupies.
 */
CellCollider.PAD = 0.01;

/**
 * Lazy-inits the mapping from a group to all the groups it hits.
 */
CellCollider.prototype.getGroupToGroups = function() {
  if (this.groupToGroups) {
    return this.groupToGroups;
  }
  // map a group to all the groups it hits
  this.groupToGroups = {};
  for (var i = 0; i < this.groupPairs.length; i++) {
    var pair = this.groupPairs[i];
    // lazy init lists
    if (!this.groupToGroups[pair[0]]) {
      this.groupToGroups[pair[0]] = [];
    }
    if (!this.groupToGroups[pair[1]]) {
      this.groupToGroups[pair[1]] = [];
    }
    // Add to lists.
    if (this.groupToGroups[pair[0]].indexOf(pair[1]) == -1) {
      this.groupToGroups[pair[0]].push(pair[1]);
    }
    if (this.groupToGroups[pair[1]].indexOf(pair[0]) == -1) {
      this.groupToGroups[pair[1]].push(pair[0]);
    }
  }
  return this.groupToGroups;
};

/**
 * Lazy-creates and returns a grid cell.
 * @param {number} x
 * @param {number} y
 */
CellCollider.prototype.getCell = function(x, y) {
  if (!this.grid[x]) {
    this.grid[x] = {};
  }
  if (!this.grid[x][y]) {
    var cell = this.grid[x][y] = {};
    var groupToGroups = this.getGroupToGroups();
    for (var group in groupToGroups) {
      cell[group] = new CellGroup();
    }
  }
  return this.grid[x][y];
};

/**
 * Adds a sledge to the collider.
 * @param {Sledge} sledge
 * @param {number} group
 * @return {number} the new sledgeId
 */
CellCollider.prototype.addSledgeInGroup = function(sledge, group) {
  var sledgeId = this.nextId++;
  this.sledges[sledgeId] = sledge;
  sledge.group = group;
  sledge.moveToTime(this.clock.getTime());

  // Add next sledge entry times to cellEntries
  this.initSledgeCellTimes(sledge);
  if (sledge.cellEntryTimeX && sledge.cellEntryTimeX <= sledge.expiration) {
    this.cellEntries.add(
        CellEntryEvent.alloc(sledge.cellEntryTimeX, null, sledgeId));
  }
  if (sledge.cellEntryTimeY && sledge.cellEntryTimeY <= sledge.expiration) {
    this.cellEntries.add(
        CellEntryEvent.alloc(null, sledge.cellEntryTimeY, sledgeId));
  }

  // Add the sledge to grid cells.
  var x0 = this.getCellIndexX(sledge.px - sledge.rx - CellCollider.PAD);
  var y0 = this.getCellIndexY(sledge.py - sledge.ry - CellCollider.PAD);
  var x1 = this.getCellIndexX(sledge.px + sledge.rx + CellCollider.PAD);
  var y1 = this.getCellIndexY(sledge.py + sledge.ry + CellCollider.PAD);
  this.addSledgeToCells(sledge, sledgeId, x0, y0, x1, y1);

  return sledgeId;
};

/**
 * Adds a sledge to a rectangular range of cells,
 * and immediately calcuates the hit times for that sledge
 * vs all others (filtered by group) in those cells.
 * @private
 */
CellCollider.prototype.addSledgeToCells = function(
    sledge, sledgeId, x0, y0, x1, y1) {
  var group = sledge.group;
  var collidesWithGroups = this.getGroupToGroups()[group];
  for (var x = x0; x <= x1; x++) {
    for (var y = y0; y <= y1; y++) {
      var cell = this.getCell(x, y);
      // For every group the sledge can collide with...
      for (var g = 0; g < collidesWithGroups.length; g++) {
        var cellGroup = cell[collidesWithGroups[g]];
        var i = 0;
        while (i < cellGroup.length) {
          var otherSledgeId = cellGroup.sledgeIds[i];
          if (!(otherSledgeId in this.sledges)) {
            cellGroup.remove(i);
            continue;
          }
          // entry is valid
          this.calcHit(sledgeId, otherSledgeId);
          i++;
        }
      }
      // Add the new sledge to its own group in this cell.
      cell[group].add(sledgeId);
    }
  }
};

/**
 * Sticks the next x and y cell entry times into the sledge,
 * and caches intermediate calc data if needed.
 * @param {Sledge} sledge  a sledge that is already moved to now.
 * @private
 */
CellCollider.prototype.initSledgeCellTimes = function(sledge) {
  var now = this.clock.getTime();
  // Sledge's cell time data hasn't been initialized, so do it now.
  var wall, positive, front, cellIndex, time;
  if (sledge.vx) {
    sledge.cellPeriodX = Math.abs(this.cellSize / sledge.vx);
    positive = sledge.vx > 0;
    // front entry
    front = sledge.px + (positive
        ? sledge.rx + CellCollider.PAD
        : -sledge.rx - CellCollider.PAD);
    cellIndex = this.getCellIndexX(front);
    sledge.frontCellIndexX = cellIndex;
    wall = this.cellSize * (cellIndex + (positive ? 1 : 0));
    time = now + (wall - front) / sledge.vx;
    if (time < now) {
      throw Error(time + " < " + now);
    }
    sledge.cellEntryTimeX = time;
  }
  if (sledge.vy) {
    sledge.cellPeriodY = Math.abs(this.cellSize / sledge.vy);
    positive = sledge.vy > 0;
    // front entry
    front = sledge.py + (positive
        ? sledge.ry + CellCollider.PAD
        : -sledge.ry - CellCollider.PAD);
    cellIndex = this.getCellIndexY(front);
    sledge.frontCellIndexY = cellIndex;
    wall = this.cellSize * (cellIndex + (positive ? 1 : 0));
    time = now + (wall - front) / sledge.vy;
    if (time < now) {
      throw Error(time + " < " + now);
    }
    sledge.cellEntryTimeY = time;
  }
};

/**
 * Calculates a hit time, if the result is not already cached,
 * @param {number} id1  ID of one sledge
 * @param {number} id2  ID of another sledge
 */
CellCollider.prototype.calcHit = function(id1, id2) {
  var sledge1 = this.sledges[id1];
  var sledge2 = this.sledges[id2];
  var out = this.hitOut;
  sledge1.calcHitTime(sledge2, out, this.clock.getTime());
  var time = out.xTime || out.yTime;
  if (time && time < Math.min(sledge1.expiration, sledge2.expiration)) {
    var hit = Hit.alloc(out.xTime, out.yTime, out.overlapping, id1, id2);
    this.hits.add(hit);
  }
};

CellCollider.prototype.removeSledge = function(sledgeId) {
  if (this.sledges[sledgeId]) {
    Sledge.free(this.sledges[sledgeId]);
    delete this.sledges[sledgeId];
  }
};

/**
 * Returns the next collision on or after 'now' but before 'beforeTime',
 * or null if there isn't any.
 * @return {?Hit}
 */
CellCollider.prototype.getNextCollisionBeforeTime = function(beforeTime) {
  while (1) {
    var hit = this.hits.getFirst();
    if (hit && !this.isHitValid(hit)) {
      Hit.free(this.hits.removeFirst());
      continue;
    }
    var entry = this.cellEntries.getFirst();
    if (entry && !this.isCellEntryValid(entry)) {
      CellEntryEvent.free(this.cellEntries.removeFirst());
      continue;
    }
    if (!hit && !entry) {
      return null;
    }
    if (hit && (!entry || hit.time < entry.time)) {
      // The hit is the next event.
      if (beforeTime <= hit.time) {
        return null;
      }
      return hit;
    }
    if (beforeTime <= entry.time) {
      return null;
    }
    // The entry is the next event.
    // It might create more hits, and maybe another CellEntryEvent.
    var sledgeId = entry.sledgeId;
    var sledge = this.sledges[sledgeId];
    sledge.moveToTime(entry.time);
    if (entry.xTime && entry.yTime) {
      throw Error('entry.xTime && entry.yTime');
    }
    if (!entry.xTime && !entry.yTime) {
      throw Error('!entry.xTime && !entry.yTime');
    }
    if (entry.xTime) {
      CellEntryEvent.free(this.cellEntries.removeFirst());
      // add to a column of cells
      sledge.frontCellIndexX += sledge.dirX;
      var x = sledge.frontCellIndexX;
      var y0 = this.getCellIndexY(sledge.py - sledge.ry - CellCollider.PAD);
      var y1 = this.getCellIndexY(sledge.py + sledge.ry + CellCollider.PAD);
      this.addSledgeToCells(sledge, sledgeId, x, y0, x, y1);
      sledge.cellEntryTimeX += sledge.cellPeriodX;
      if (sledge.cellEntryTimeX <= sledge.expiration) {
        this.cellEntries.add(
            CellEntryEvent.alloc(sledge.cellEntryTimeX, null, sledgeId));
      }
    } else if (entry.yTime) {
      CellEntryEvent.free(this.cellEntries.removeFirst());
      // add to a row of cells
      sledge.frontCellIndexY += sledge.dirY;
      var y = sledge.frontCellIndexY;
      var x0 = this.getCellIndexX(sledge.px - sledge.rx - CellCollider.PAD);
      var x1 = this.getCellIndexX(sledge.px + sledge.rx + CellCollider.PAD);
      this.addSledgeToCells(sledge, sledgeId, x0, y, x1, y);
      sledge.cellEntryTimeY += sledge.cellPeriodY;
      if (sledge.cellEntryTimeY <= sledge.expiration) {
        this.cellEntries.add(
            CellEntryEvent.alloc(null, sledge.cellEntryTimeY, sledgeId));
      }
    }
  }
};

CellCollider.prototype.isHitValid = function(hit) {
  return hit.time >= this.clock.getTime() &&
      !!this.sledges[hit.sledgeId1] &&
      !!this.sledges[hit.sledgeId2];
};

CellCollider.prototype.isCellEntryValid = function(entry) {
  if (entry.time < this.clock.getTime()) {
    throw 'entry.time < now';
  }
  return !!this.sledges[entry.sledgeId];
};

/**
 * @returns the grid cell X index that corresponds with the x value.
 */
CellCollider.prototype.getCellIndexX = function(x) {
  return Math.floor(x / this.cellSize);
};

/**
 * @returns the grid cell Y index that corresponds with the y value.
 */
CellCollider.prototype.getCellIndexY = function(y) {
  return Math.floor(y / this.cellSize);
};

CellCollider.prototype.getWorldXForIndexX = function(ix) {
  return this.cellSize * ix;
};

CellCollider.prototype.getWorldYForIndexY = function(iy) {
  return this.cellSize * iy;
};

CellCollider.prototype.rayScan = function(rayScan, group) {
  var x0 = rayScan.x0;
  var y0 = rayScan.y0;
  var x1 = rayScan.x1;
  var y1 = rayScan.y1;
  var rx = rayScan.rx;
  var ry = rayScan.ry;

  // First check overlapping cells for an immediate collision
  var ix0 = this.getCellIndexX(x0 - rx);
  var iy0 = this.getCellIndexY(y0 - ry);
  var ix1 = this.getCellIndexX(x0 + rx);
  var iy1 = this.getCellIndexY(y0 + ry);
  for (var ix = ix0; ix <= ix1; ix++) {
    for (var iy = iy0; iy <= iy1; iy++) {
      this.rayScanCell(rayScan, ix, iy, group);
    }
  }

  var t = 0; // time from 0 to 1
  var dx = x1 - x0;
  var dy = y1 - y0;
  var dirX = Math.sgn(dx) || 1;
  var dirY = Math.sgn(dy) || 1;
  var leadX0 = x0 + rx * dirX;
  var leadY0 = y0 + ry * dirY;
  var leadX = leadX0;
  var leadY = leadY0;
  var tailOffsetX = -2 * rx * dirX;
  var tailOffsetY = -2 * ry * dirY;
  var periodX = dx ? Math.abs(this.cellSize / dx) : 0;
  var periodY = dy ? Math.abs(this.cellSize / dy) : 0;
  var leadIndexX = this.getCellIndexX(leadX);
  var leadIndexY = this.getCellIndexY(leadY);
  var tailIndexX;
  var tailIndexY;

  var nextWallX = this.getWorldXForIndexX(leadIndexX + (dirX == 1 ? 1 : 0));
  var nextWallY = this.getWorldYForIndexY(leadIndexY + (dirY == 1 ? 1 : 0));

  var timeOfWallX = dx ? (nextWallX - leadX) / dx : Infinity;
  var timeOfWallY = dy ? (nextWallY - leadY) / dy : Infinity;

  while (timeOfWallX <= 1 || timeOfWallY <= 1) {
    if (timeOfWallX < timeOfWallY) {
      leadIndexX += dirX;
      leadY = leadY0 + timeOfWallX * dy;
      tailIndexY = this.getCellIndexY(leadY + tailOffsetY);
      if (tailIndexY < leadIndexY) {
        iy0 = tailIndexY;
        iy1 = leadIndexY;
      } else {
        iy0 = leadIndexY;
        iy1 = tailIndexY;
      }
      for (var iy = iy0; iy <= iy1; iy++) {
        this.rayScanCell(rayScan, leadIndexX, iy, group);
      }
      timeOfWallX += periodX;
    } else {
      t = timeOfWallY;
      leadIndexY += dirY;
      leadX = leadX0 + timeOfWallY * dx;
      tailIndexX = this.getCellIndexX(leadX + tailOffsetX);
      if (tailIndexX < leadIndexX) {
        ix0 = tailIndexX;
        ix1 = leadIndexX;
      } else {
        ix0 = leadIndexX;
        ix1 = tailIndexX;
      }
      for (var ix = ix0; ix <= ix1; ix++) {
        this.rayScanCell(rayScan, ix, leadIndexY, group);
      }
      timeOfWallY += periodY;
    }
    var hitTime = rayScan.xTime || rayScan.yTime || Infinity;
    var wallTime = Math.min(timeOfWallX, timeOfWallY);
    if (hitTime < wallTime) {
      // The detected hit occurs prior to any other hit we could find.
      break;
    }
  }
  if (FLAGS && FLAGS.get('debugRayScans')) {
    var drawTime = hitTime == Infinity ? 1 : hitTime;
    this.marks.push(
        Mark.alloc(Mark.Type.LINE,
            drawTime == 1 ? '#a0a' : '#f0f',
            x0, y0,
            x0 + (x1 - x0) * drawTime, y0 + (y1 - y0) * drawTime));
  }
};

/**
 * Updates the rayscan with the earliest scan hit, if any.
 */
CellCollider.prototype.rayScanCell = function(rayScan, x, y, group) {
  if (FLAGS && FLAGS.get('debugRayScans')) {
    // mark cell walls
    this.marks.push(Mark.alloc(Mark.Type.DRAWRECT, '#808',
        this.getWorldXForIndexX(x), this.getWorldYForIndexY(y),
        this.getWorldXForIndexX(x + 1), this.getWorldYForIndexY(y + 1)));
  }
  var now = this.clock.getTime();

  var cell = this.getCell(x, y);
  // For every group the rayScan can collide with...
  var collidesWithGroups = this.getGroupToGroups()[group];
  for (var g = 0; g < collidesWithGroups.length; g++) {
    var cellGroup = cell[collidesWithGroups[g]];
    var i = 0;
    while (i < cellGroup.length) {
      var sledgeId = cellGroup.sledgeIds[i];
      var sledge = this.sledges[sledgeId];
      if (!sledge) {
        cellGroup.remove(i);
        continue;
      }
      // entry is valid - perform the scan
      rayScan.calcSledgeHit(sledge, sledgeId, now);
      i++;
    }
  }
};

CellCollider.prototype.draw = function(renderer) {
  for (var i = 0; i < this.marks.length; i++) {
    renderer.drawMark(this.marks[i]);
    Mark.free(this.marks[i]);
  }
  this.marks.length = 0;
};
