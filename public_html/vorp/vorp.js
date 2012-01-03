/**
 * @constructor
 */
function Vorp(renderer, phy, wham, gameClock, baseSpriteTemplate) {
  FLAGS && FLAGS.init('portalScry', true);
  this.renderer = renderer;
  this.phy = phy;
  this.wham = wham;
  this.gameClock = gameClock;
  this.baseSpriteTemplate = baseSpriteTemplate;

  this.playerSprite = null;
  this.cameraPos = new Vec2d();
  this.painters = [];
  
  // Portals have super-special view-through rendering, so we gonna track em.
  this.portals = [];
  this.portalPos1 = new Vec2d();
  this.portalPos2 = new Vec2d();

  this.accelerationsOut = [new Vec2d(), new Vec2d()];
}

Vorp.PORTAL_SCRY_RADIUS = 160;

Vorp.FRICTION = 0.1;


// Target frames per second.
Vorp.FPS = 45;

Vorp.PLAYER_GROUP = 1;
Vorp.WALL_GROUP = 2;
Vorp.GENERAL_GROUP = 3;
Vorp.ZAPPER_GROUP = 4;
Vorp.PORTAL_GROUP = 5;
Vorp.PORTAL_PROBE_GROUP = 6;
Vorp.GRIP_BLOCKER_GROUP = 7;
Vorp.EMPTY_GROUP = 8;
Vorp.NO_HIT_GROUP = 9;

Vorp.COLLIDER_GROUP_PAIRS = [
  [Vorp.WALL_GROUP, Vorp.PLAYER_GROUP],

  [Vorp.GENERAL_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.GENERAL_GROUP, Vorp.WALL_GROUP],
  [Vorp.GENERAL_GROUP, Vorp.GENERAL_GROUP],

  [Vorp.ZAPPER_GROUP, Vorp.PLAYER_GROUP],

  [Vorp.PORTAL_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.WALL_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.GENERAL_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.PORTAL_GROUP],

  [Vorp.PORTAL_PROBE_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.WALL_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.GENERAL_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.PORTAL_GROUP],

  [Vorp.GRIP_BLOCKER_GROUP, Vorp.WALL_GROUP],
  
  [Vorp.EMPTY_GROUP, Vorp.EMPTY_GROUP],
  [Vorp.NO_HIT_GROUP, Vorp.EMPTY_GROUP]
];

Vorp.CELL_SIZE = 100;

// Ordered list of paint layers
Vorp.LAYERS = [
  Vorp.LAYER_SPARKS = 'sparks',
  Vorp.LAYER_MASSES = 'masses',
  Vorp.LAYER_SUPERSPARKS = 'oversparks',
  Vorp.LAYER_DEBUG = 'debug'
];

Vorp.start = function(levelBuilder, canvas, flagsDiv, opt_camera) {
  var camera = opt_camera || new Camera();
  var renderer = new Renderer(canvas, camera);
  window.FLAGS = new Flags(flagsDiv);

  var gameClock = new GameClock(1);
  var sledgeInvalidator = new SledgeInvalidator();
  var collider = new CellCollider(levelBuilder.getBoundingRect(),
      Vorp.CELL_SIZE, Vorp.COLLIDER_GROUP_PAIRS, gameClock);
  var wham = new VorpWham();
  var phy = new Phy(collider, gameClock, sledgeInvalidator);
  var baseSpriteTemplate = new SpriteTemplate()
	.setGameClock(gameClock)
	.setSledgeInvalidator(sledgeInvalidator);
  var vorp = new Vorp(renderer, phy, wham, gameClock, baseSpriteTemplate);
  phy.setOnSpriteHit(vorp, vorp.onSpriteHit);

  var prefabs = levelBuilder.getPrefabs();
  var playerPrefab = null;
  for (var i = 0; i < prefabs.length; i++) {
    var prefab = prefabs[i];
    var sprites = prefab.createSprites(baseSpriteTemplate);
    vorp.addSprites(sprites);
    if (prefab instanceof PlayerAssemblerPrefab && prefab.isEntrance) {
      if (playerPrefab) throw Error('player prefab already defined');
      vorp.playerAssembler = sprites[0];
      vorp.assemblePlayer();
    }
  }
  GU_start(function(){vorp.clock();}, Vorp.FPS);
}

Vorp.prototype.addSprites = function(sprites) {
  for (var i = 0; i < sprites.length; i++) {
    this.addSprite(sprites[i]);
  }
};

/**
 * @param {Sprite} sprite
 */
Vorp.prototype.addSprite = function(sprite) {
  this.phy.addSprite(sprite);
  var painter = sprite.getPainter(); 
  if (painter) {
    this.addPainter(painter);
  }
  if (sprite instanceof PortalSprite) {
    this.portals.push(sprite);
  }
};

/**
 * @param {Painter} painter
 */
Vorp.prototype.addPainter = function(painter) {
  this.painters.push(painter);
};

/**
 * @param {Sprite} sprite
 */
Vorp.prototype.setPlayerSprite = function(sprite) {
  this.playerSprite = sprite;
};

/**
 * Moves time forward by one and then draws.
 */
Vorp.prototype.clock = function() {
  this.phy.clock(1);
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    sprite.portalCount = 0;
  }
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    if (sprite.mass != Infinity) {
      sprite.invalidateSledge();
    }
    sprite.act(this);
  }
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    sprite.affect(this);
  }
  this.draw();
};

/**
 * Draws to the canvas.
 */
Vorp.prototype.draw = function() {
  var now = this.now();
  this.renderer.clear();
  this.renderer.setZoom(0.37);
  if (this.playerSprite) {
    this.playerSprite.getPos(this.cameraPos);
  }
  
  // Tell painters to advance. Might as well remove any that are kaput.
  // (The timing of isKaput() returning true isn't critical;
  // it doesn't have to be decided during advance().)
  for (var i = 0; i < this.painters.length; i++) {
    var painter = this.painters[i];
    if (painter.isKaput()) {
      var popped = this.painters.pop();
      if (i < this.painters.length) {
        this.painters[i] = popped;
        i--;
      } // else we're trying to remove the final one
    } else {
      painter.advance(now);
    }
  }

  var portalScry = !FLAGS || FLAGS.get('portalScry');
  if (portalScry) {
    // Each portal draws its target's environment around it.  OMG so freaky.
    for (var i = 0; i < this.portals.length; i++) {
      var portal = this.portals[i];
      if (!portal.targetSprite) continue;
      portal.getPos(this.portalPos1);
      portal.targetSprite.getPos(this.portalPos2);
      this.renderer.setCenter(
          this.cameraPos.x + (this.portalPos1.x - this.portalPos2.x),
          this.cameraPos.y + (this.portalPos1.y - this.portalPos2.y));
      this.drawWorld(false, this.portalPos1);
    }
  }
  
  // Center the drawing transform on the normal camera pos - the player.
  this.renderer.setCenter(this.cameraPos.x, this.cameraPos.y);
  
  if (portalScry) {
    // Cover the portal previews a little, to dim them compared to the "real" world
    this.renderer.setFillStyle('rgba(25, 50, 50, 0.75)');
    this.renderer.transformStart();
    for (var i = 0; i < this.portals.length; i++) {
      this.renderer.context.beginPath();
      portal = this.portals[i];
      portal.getPos(this.portalPos1);
      this.renderer.context.arc(
          this.portalPos1.x,
          this.portalPos1.y,
          Vorp.PORTAL_SCRY_RADIUS + 2,
          0, Math.PI * 2,
          true);
      this.renderer.context.fill();
    }
    this.renderer.transformEnd();
  }
  
  // Set up the viewport for player-centered rendering.
  this.drawWorld(true);

  this.renderer.stats();
};

/**
 * @param {boolean=} opt_drawColliderDebugging
 * @param {Vec2d=} opt_portalClipPos
 */
Vorp.prototype.drawWorld = function(opt_drawColliderDebugging, opt_portalClipPos) {
  this.renderer.transformStart();

  if (opt_portalClipPos) {
    this.renderer.context.beginPath();
    this.renderer.context.arc(
        opt_portalClipPos.x,
        opt_portalClipPos.y,
        Vorp.PORTAL_SCRY_RADIUS,
        0, Math.PI * 2,
        true);
    this.renderer.context.clip();
  }
  
  // painters paint in layers
  for (var i = 0; i < Vorp.LAYERS.length; i++) {
    var layer = Vorp.LAYERS[i];
    for (var j = 0; j < this.painters.length; j++) {
      var painter = this.painters[j]; 
      painter.paint(this.renderer, layer);
    }
  }
  
  if (opt_drawColliderDebugging) {
    // Draw whatever the collider feels like drawing, for debugging purposes.
    this.phy.collider.draw(this.renderer);
  }

  this.renderer.transformEnd();
};

Vorp.prototype.now = function() {
  return this.gameClock.getTime();
};

Vorp.prototype.getPlayerSprite = function() {
  return this.playerSprite;
};

Vorp.prototype.exitToUrl = function(url) {
  window.location = url;
};

Vorp.prototype.removeSprite = function(id) {
  this.phy.removeSprite(id);
};

Vorp.prototype.killPlayer = function() {
  // save a dead player for later
  var deadPlayerPrefab = new DeadPlayerPrefab(
      this.playerSprite.pos.x,
      this.playerSprite.pos.y);
  var deadPlayerSprites = deadPlayerPrefab.createSprites(this.gameClock);
  this.addSprites(deadPlayerSprites);
  
  // remove normal player sprite
  this.playerSprite.die();
  this.removeSprite(this.playerSprite.id);

  this.playerSprite = deadPlayerSprites[0];
};

Vorp.prototype.assemblePlayer = function() {
  if (this.playerSprite) {
    this.removeSprite(this.playerSprite.id);
  }
  var target = this.playerAssembler.targetPos;
  var playerPrefab = new PlayerPrefab(target.x, target.y);
  var playerSprites = playerPrefab.createSprites(this.baseSpriteTemplate);
  this.playerSprite = playerSprites[0];
  this.addSprites(playerSprites);
  this.playerAssembler.onPlayerAssembled();
};

/**
 * Performs a rayscan, and sets rayscan.hitSpriteId to the sprite ID or null
 * if there wasn't any.
 * @param {RayScan} rayScan
 * @param {number} group
 * @return the hitSpriteId, or null if there wasn't any.
 */
Vorp.prototype.rayScan = function(rayScan, group) {
  this.phy.rayScan(rayScan, group);
  rayScan.hitSpriteId = rayScan.hitSledgeId
      ? this.phy.getSpriteBySledgeId(rayScan.hitSledgeId)
      : null;
  return rayScan.hitSpriteId;
};

Vorp.prototype.getSprite = function(id) {
  return this.phy.getSprite(id);
};


Vorp.GRIP = 0.5;
Vorp.ELASTICITY = 0.8;

/**
 * Mutates sprites.
 * @param spriteId1
 * @param spriteId2
 * @param xTime
 * @param yTime
 * @param overlapping
 */
Vorp.prototype.onSpriteHit = function(spriteId1, spriteId2, xTime, yTime, overlapping) {
  var s1 = this.getSprite(spriteId1);
  var s2 = this.getSprite(spriteId2);

  if (overlapping) {
    this.wham.calcRepulsion(s1, s2, this.accelerationsOut);
  } else {
    this.wham.calcAcceleration(s1, s2, xTime, yTime,
        Vorp.GRIP, Vorp.ELASTICITY,
        this.accelerationsOut);
  }
  var a1 = this.accelerationsOut[0];
  var a2 = this.accelerationsOut[1];

  var handled = false;
  if (!handled && s1 instanceof PortalSprite && !(s2 instanceof PortalSprite)) {
    handled = s1.onSpriteHit(s2, this, a1, a2, xTime, yTime, overlapping);
  }
  if (!handled && s2 instanceof PortalSprite && !(s1 instanceof PortalSprite)) {
    handled = s2.onSpriteHit(s1, this, a2, a1, xTime, yTime, overlapping);
  }
  if (!handled) {
    s1.addVel(a1);
    s2.addVel(a2);
    s1.onSpriteHit(s2, this);
    s2.onSpriteHit(s1, this);
  }
};

