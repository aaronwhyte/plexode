Math.sgn = Math.sgn || function(n) {
  if (n == 0) return 0;
  if (n > 0) return 1;
  return -1;
};

/**
 * @param {CellCollider} collider
 * @param {GameClock} gameClock
 * @constructor
 */
function Phy(collider, gameClock, sledgeInvalidator) {
  this.collider = collider;
  this.gameClock = gameClock;
  this.sledgeInvalidator = sledgeInvalidator;

  this.sledgeIdToSpriteId = {};
  this.spriteIdToSledgeId = {};
  this.sprites = {}; // ID to object
  this.sledges = {}; // ID to object, doy
  this.spriteTimeouts = new SkipQueue(100);
  
  this.onSpriteHitObj = null;
  this.onSpriteHitFn = null;
}

Phy.prototype.setOnSpriteHit = function(obj, fn) {
  this.onSpriteHitObj = obj;
  this.onSpriteHitFn = fn;
};

/**
 * @param {SpriteTimeout} spriteTimeout
 * @return {boolean}
 */
Phy.prototype.isSpriteTimeoutValid = function(spriteTimeout) {
  return spriteTimeout.time >= this.now() &&
      !!this.sprites[spriteTimeout.spriteId];
};

/**
 * Adds the sprite here, and inserts a sledge into the multicollider.
 * @param {Sprite} sprite
 */
Phy.prototype.addSprite = function(sprite) {
  if (!sprite) throw "no sprite";
  this.sprites[sprite.id] = sprite;
  this.sledgeInvalidator.add(sprite.id);
};

/**
 * Removes the sprite, and removes its sledge from the collider.
 * @param spriteId
 */
Phy.prototype.removeSprite = function(spriteId) {
  var sprite = this.sprites[spriteId];
  if (!sprite) throw "no sprite with id: " + spriteId;
  var sledgeId = this.spriteIdToSledgeId[spriteId];
  if (sledgeId) {
    this.removeSledge(sledgeId);
  } else if (!this.sledgeInvalidator.contains(spriteId)) {
    throw 'no sledge and no sledgeless entry for sprite ' + sprite;
  }
  delete this.sprites[spriteId];
  this.sledgeInvalidator.remove(spriteId);
};

/**
 * Adds the sledge to the collider and the sprite, and to this.
 * Removes the sprite's old sledge first.
 * @param {Sledge} sledge
 * @param spriteId
 * @return new sledgeId
 * @private
 */
Phy.prototype.bindSledgeToSpriteId = function(sledge, spriteId) {
  if (!spriteId) throw "no spriteId";
  if (!sledge) throw "no sledge";
  var sprite = this.sprites[spriteId];
  if (!sprite) throw "no sprite with id: " + spriteId;
  // remove old sledge if any
  var oldSledgeId = this.spriteIdToSledgeId[spriteId];
  if (oldSledgeId) {
    this.removeSledge(oldSledgeId);
  }
  // add new sledge
  var sledgeId = this.collider.addSledgeInGroup(sledge, sprite.group);
  this.sledgeIdToSpriteId[sledgeId] = spriteId;
  this.spriteIdToSledgeId[spriteId] = sledgeId;
  this.sledgeInvalidator.remove(spriteId);
  return sledgeId;
};

/**
 * Removes the sledge from maps and from the collider.
 * Probably only called from removeSprite and setSledgeForSpriteId.
 * @param sledgeId
 * @private
 */
Phy.prototype.removeSledge = function(sledgeId) {
  if (!sledgeId) throw 'no sledgeId';
  var spriteId = this.sledgeIdToSpriteId[sledgeId];
  if (!spriteId) throw 'no spriteId for sledgeId: ' + sledgeId;
  if (!this.spriteIdToSledgeId[spriteId]) throw 'blarg';

  delete this.spriteIdToSledgeId[spriteId];
  delete this.sledgeIdToSpriteId[sledgeId];
  this.collider.removeSledge(sledgeId);
  // Don't remove the sprite from the invalidator here. Only do that if the
  // sprite is being removed, or if a valid new sledge is created.
};

/**
 * @private
 */
Phy.prototype.updateSledges = function() {
  var spriteId;
  // remove invalid sledges
  for (spriteId in this.sledgeInvalidator.spriteIds) {
    var sledgeId = this.spriteIdToSledgeId[spriteId];
    if (sledgeId) {
      this.removeSledge(sledgeId);
    }
  }
  // create new sledges for sprites
  for (spriteId in this.sledgeInvalidator.spriteIds) {
    if (this.spriteIdToSledgeId[spriteId]) {
      throw 'sledgelessSprite id ' + spriteId + ' has a sledge id ' +
          this.spriteIdToSledgeId[spriteId];
    }
    var sprite = this.sprites[spriteId];
    var sledge = sprite.createSledge();
    this.bindSledgeToSpriteId(sledge, spriteId);
  }
};

/**
 * @param sledgeId
 * @return {Sprite}
 */
Phy.prototype.getSpriteBySledgeId = function(sledgeId) {
  var spriteId = this.sledgeIdToSpriteId[sledgeId];
  return this.sprites[spriteId];
};

/**
 * @param sledgeId
 * @return {number?}
 */
Phy.prototype.getSpriteIdBySledgeId = function(sledgeId) {
  return this.sledgeIdToSpriteId[sledgeId];
};

/**
 * @param spriteId
 * @return {Sprite}
 */
Phy.prototype.getSprite = function(spriteId) {
  return this.sprites[spriteId];
};

/**
 * @param {Sprite} sprite
 * @return {number}
 */
Phy.prototype.getSpriteId = function(sprite) {
  for (var spriteId in this.sprites) {
    if (this.sprites[spriteId] == sprite) {
      return spriteId;
    }
  }
  return null;
};

/**
 * Moves time forward.
 * @param {number} duration
 */
Phy.prototype.clock = function(duration) {
  var endTime = this.now() + duration;
  var hit = this.getNextCollisionBeforeTime(endTime);
  var spriteTimeout = this.getFirstSpriteTimeoutBeforeTime(endTime);
  while (hit != null || spriteTimeout != null) {

    // Is the hit first?
    if (!spriteTimeout || (hit && hit.time < spriteTimeout.time)) {
      // hit is before timeout

      // advance time to this collision
      this.gameClock.setTime(hit.time);
      // sledge/sledge hit
      var spriteId1 = this.sledgeIdToSpriteId[hit.sledgeId1];
      var spriteId2 = this.sledgeIdToSpriteId[hit.sledgeId2];
      this.onSpriteHitFn.call(this.onSpriteHitObj,
          spriteId1, spriteId2, hit.xTime, hit.yTime, hit.overlapping);
    } else {
      // timeout is before hit
      this.gameClock.setTime(spriteTimeout.time);
      this.sprites[spriteTimeout.spriteId].onTimeout(spriteTimeout, this);
      SpriteTimeout.free(this.spriteTimeouts.removeFirst());
    }
    // Timeouts and collisions change things.  Get everything fresh.
    spriteTimeout = this.getFirstSpriteTimeoutBeforeTime(endTime);
    hit = this.getNextCollisionBeforeTime(endTime);
  }

  // advance time to the end of this frame
  this.gameClock.setTime(endTime);
};

/**
 * @param {number} beforeTime
 * @return {?Hit}
 * @private
 */
Phy.prototype.getNextCollisionBeforeTime = function(beforeTime) {
  this.updateSledges();
  return this.collider.getNextCollisionBeforeTime(beforeTime);
};

/**
 * @param {number} beforeTime
 * @return {?SpriteTimeout}
 * @private
 */
Phy.prototype.getFirstSpriteTimeoutBeforeTime = function(beforeTime) {
  while (1) {
    var spriteTimeout = this.spriteTimeouts.getFirst();
    if (!spriteTimeout) return null;
    if (!this.isSpriteTimeoutValid(spriteTimeout)) {
      SpriteTimeout.free(this.spriteTimeouts.removeFirst());
    } else if (spriteTimeout.time >= beforeTime) {
      return null;
    } else {
      // hit is valid and in time range
      return spriteTimeout;
    }
  }
};

/**
 * @return {number}
 */
Phy.prototype.now = function() {
  return this.gameClock.getTime();
};

/**
 * @param {SpriteTimeout} spriteTimeout
 */
Phy.prototype.addSpriteTimeout = function(spriteTimeout) {
  this.spriteTimeouts.add(spriteTimeout);
};

/**
 * @param {RayScan} rayScan
 * @param {number} group
 */
Phy.prototype.rayScan = function(rayScan, group) {
  this.updateSledges();
  this.collider.rayScan(rayScan, group);
};
