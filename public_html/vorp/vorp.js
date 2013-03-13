/**
 * @constructor
 */
function Vorp(renderer, phy, wham, gameClock, sledgeInvalidator) {
  FLAGS && FLAGS.init('portalScry', true);
  this.renderer = renderer;
  this.phy = phy;
  this.wham = wham;
  this.gameClock = gameClock;
  this.sledgeInvalidator = sledgeInvalidator;

  this.playerSprite = null;
  this.cameraPos = new Vec2d();
  this.painters = [];

  // Portals have super-special view-through rendering, so we gonna track em.
  this.portals = [];
  this.portalPos1 = new Vec2d();
  this.portalPos2 = new Vec2d();

  this.accelerationsOut = [new Vec2d(), new Vec2d()];

  this.links = {};
  this.editable = false;
}

Vorp.PORTAL_SCRY_RADIUS = 160;

Vorp.FRICTION = 0.07;

Vorp.ZOOM = 0.34;

// Target frames per second.
Vorp.FPS = 60;

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
  Vorp.LAYER_SUPERSPARKS = 'supersparks'
];
// optional layers
Vorp.LAYER_DEBUG = 'debug';
Vorp.LAYER_EDIT = 'edit';

Vorp.createVorp = function(renderer, gameClock, sledgeInvalidator) {
  var collider = new CellCollider(
      Vorp.CELL_SIZE, Vorp.COLLIDER_GROUP_PAIRS, gameClock);
  var wham = new VorpWham();
  var phy = new Phy(collider, gameClock, sledgeInvalidator);
  var vorp = new Vorp(renderer, phy, wham, gameClock, sledgeInvalidator);
  phy.setOnSpriteHit(vorp, vorp.onSpriteHit);
  return vorp;
};

Vorp.prototype.startLoop = function() {
  if (!this.editable) {
    this.resize();
    if (!this.listeners) {
      // TODO: remove all GU_* stuff
      GU_keys.length = 0;
      this.listeners = new plex.event.ListenerTracker();
      this.listeners.addListener(document, 'keydown', GU_keyDown);
      this.listeners.addListener(document, 'keyup', GU_keyUp);
      this.listeners.addListener(window, 'resize', this.getResizeListener());
    }
  }
  if (!this.loop) {
    var self = this;
    this.loop = new plex.Loop(
        function() {
          self.clock();
        },
        Vorp.FPS);
  }
  this.loop.start();
};

Vorp.prototype.stopLoop = function() {
  if (this.listeners) {
    this.listeners.removeAllListeners();
    this.listeners = null;
    GU_keys.length = 0;
  }
  if (this.loop) {
    this.loop.stop();
  }
};

Vorp.prototype.getResizeListener = function() {
  var self = this;
  return function(event) {
    self.resize();
  };
};

Vorp.prototype.resize = function() {
  var header = document.getElementById('levelHeader');
  var headerHeight = (header && header.offsetHeight + header.offsetTop) || 0;
  var footer = document.getElementById('levelFooter');
  var footerHeight = (footer && footer.offsetHeight) || 0;

  var s = plex.window.getSize();
  var maxHeight = s.height - (footerHeight + headerHeight);
  var maxWidth = s.width;
  var dim = Math.min(maxWidth, maxHeight);
  var canvas = this.renderer.canvas;
  canvas.width = dim;
  canvas.height = dim;
  var left;
  if (maxWidth < maxHeight) {
    left = '0';
  } else {
    left = (s.width / 2 - dim / 2) + 'px';
  }
  canvas.style.left = left;
  canvas.style.top = headerHeight + 'px';

  this.canvasSize = dim;
};


Vorp.prototype.getBaseSpriteTemplate = function() {
  if (!this.baseSpriteTemplate) {
    this.baseSpriteTemplate = VorpSpriteTemplate.createBase(this, this.gameClock, this.sledgeInvalidator);
  }
  return this.baseSpriteTemplate;
};

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
  if (sprite instanceof PlayerAssemblerSprite) {
    // Assume there's exactly one PlayerAssembler per level for now.
    /** @type {PlayerAssemblerSprite} */
    this.playerAssembler = sprite;
    this.assemblePlayer();
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
 * @param {LogicLink} link
 */
Vorp.prototype.addLogicLink = function(link) {
  var id = link.id;
  if (!id) throw "Invalid falsy link ID: " + id;
  if (this.links[id]) throw "Link with ID " + id + " already exists.";
  this.links[id] = link;
};

/**
 * @return a new array with all sprites in it. Probably useful for tests.
 */
Vorp.prototype.getSprites = function() {
  var sprites = [];
  for (var id in this.phy.sprites) {
    sprites.push(this.phy.sprites[id]);
  }
  return sprites;
};

/**
 * Moves time forward by one and then draws.
 */
Vorp.prototype.clock = function() {
  this.phy.clock(1);
  this.clockSprites();
  this.clockLinks();
  this.draw();
};

Vorp.prototype.clockSprites = function() {
  // clear teleport counts
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    sprite.portalCount = 0;
  }
  // sprites act
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    if (sprite.sledgeDuration != Infinity) {
      sprite.invalidateSledge();
    }
    sprite.act(this);
  }
  // sprites are affected by simultaneous accelerations
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    sprite.affect(this);
  }
};

Vorp.prototype.clockLinks = function() {
  // Clear old input buffers.
  for (var id in this.links) {
    var link = this.links[id];
    var inputSprite = this.getSprite(link.inputSpriteId);
    if (!inputSprite) throw "no sprite with ID " + link.inputSpriteId;
    inputSprite.clearInputs();
  }
  // Set new input buffer values.
  for (var id in this.links) {
    var link = this.links[id];
    var outputSprite = this.getSprite(link.outputSpriteId);
    if (!outputSprite) throw "no sprite with ID " + link.outputSpriteId;
    var inputSprite = this.getSprite(link.inputSpriteId);
    inputSprite.addToInput(link.inputIndex, outputSprite.outputs[link.outputIndex]);
  }
};

/**
 * Draws to the canvas.
 */
Vorp.prototype.draw = function() {
  var now = this.now();
  this.renderer.clear();
  if (!this.editable) {
    this.renderer.setZoom(Vorp.ZOOM * this.canvasSize / 600);
  }
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

  var portalScry = false;//!FLAGS || FLAGS.get('portalScry');
  if (portalScry) {
    // Each portal draws its target's environment around it.  OMG so freaky.
    for (var i = 0; i < this.portals.length; i++) {
      var portal = this.portals[i];
      if (!portal.targetSprite) continue;
      portal.getPos(this.portalPos1);
      portal.targetSprite.getPos(this.portalPos2);
      if (!this.editable) {
        this.renderer.setCenter(
            this.cameraPos.x + (this.portalPos1.x - this.portalPos2.x),
            this.cameraPos.y + (this.portalPos1.y - this.portalPos2.y));
      }
      this.drawWorld(false, this.portalPos1);
    }
  }

  // Center the drawing transform on the normal camera pos - the player.
  if (!this.editable) {
    this.renderer.setCenter(this.cameraPos.x, this.cameraPos.y);
  }

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

  for (var i = 0; i < Vorp.LAYERS.length; i++) {
    this.drawLayer(Vorp.LAYERS[i]);
  }
  if (this.editable) {
    this.drawLayer(Vorp.LAYER_EDIT);
  }

  if (opt_drawColliderDebugging) {
    // Draw whatever the collider feels like drawing, for debugging purposes.
    this.phy.collider.draw(this.renderer);
  }

  this.renderer.transformEnd();
};

Vorp.prototype.drawLayer = function(layer) {
  for (var j = 0; j < this.painters.length; j++) {
    var painter = this.painters[j];
    painter.paint(this.renderer, layer);
  }
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

Vorp.prototype.getDeadPlayerSpritefactory = function() {
  if (!this.deadPlayerSpriteFactory) {
    this.deadPlayerSpriteFactory = new DeadPlayerSpriteFactory(this.getBaseSpriteTemplate());
  }
  return this.deadPlayerSpriteFactory;
};

Vorp.prototype.killPlayer = function() {
  // save a dead player for later
  var playerPos = this.playerSprite.getPos(new Vec2d());
  var deadPlayerSprite = this.getDeadPlayerSpritefactory().createXY(playerPos.x, playerPos.y);
  this.addSprite(deadPlayerSprite);

  // remove normal player sprite
  this.playerSprite.die();
  this.removeSprite(this.playerSprite.id);

  this.playerSprite = deadPlayerSprite;
};

Vorp.prototype.assemblePlayer = function() {
  if (this.playerSprite) {
    this.removeSprite(this.playerSprite.id);
  }
  this.playerSprite = this.playerAssembler.createPlayer();
  this.addSprite(this.playerSprite);
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
      ? this.phy.getSpriteIdBySledgeId(rayScan.hitSledgeId)
      : null;
  return rayScan.hitSpriteId;
};

Vorp.prototype.getSprite = function(id) {
  return this.phy.getSprite(id);
};


/**
 * Extent to which one object will pull another along perpendicular to the collision axis.
 * @type {Number}
 */
Vorp.GRIP = 0.5;

/**
 * How much things bounce off of each other along the collision axis.
 * Weird interpenetration stuff happens at less than 0.5.
 * @type {Number}
 */
Vorp.ELASTICITY = 0.6;

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
    handled = s1.onSpriteHit(s2, a1, a2, xTime, yTime, overlapping);
  }
  if (!handled && s2 instanceof PortalSprite && !(s1 instanceof PortalSprite)) {
    handled = s2.onSpriteHit(s1, a2, a1, xTime, yTime, overlapping);
  }
  if (!handled) {
    s1.addVel(a1);
    s2.addVel(a2);
    s1.onSpriteHit(s2);
    s2.onSpriteHit(s1);
  }
};

