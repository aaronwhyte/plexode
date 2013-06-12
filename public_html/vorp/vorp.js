/**
 * @constructor
 */
function Vorp(vorpOut, phy, wham, gameClock, sledgeInvalidator) {
  this.vorpOut = vorpOut;
  this.phy = phy;
  this.wham = wham;
  this.gameClock = gameClock;
  this.sledgeInvalidator = sledgeInvalidator;

  this.playerSprite = null;
  this.playerAssemblyTime = null;
  this.cameraPos = new Vec2d();

  this.accelerationsOut = [new Vec2d(), new Vec2d()];

  this.links = {};
  this.editable = false;
}

Vorp.EXPLODED_PLAYER_REASSEMBLY_DELAY = 30;
Vorp.ZOMBIFIED_PLAYER_REASSEMBLY_DELAY = 40;

Vorp.PORTAL_SCRY_RADIUS = 160;

Vorp.FRICTION = 0.07;

Vorp.ZOOM = 0.34;

// Target frames per second.
Vorp.FPS = 60;

Vorp.EMPTY_GROUP = 1;
Vorp.NO_HIT_GROUP = 2;
Vorp.PLAYER_GROUP = 3;
Vorp.MONSTER_GROUP = 4;
Vorp.WALL_GROUP = 5;
Vorp.GENERAL_GROUP = 6;
Vorp.ZAPPER_GROUP = 7;
Vorp.PORTAL_GROUP = 8;
Vorp.PORTAL_PROBE_GROUP = 9;
Vorp.PORTAL_REPEL_GROUP = 10
Vorp.GRIP_BLOCKER_GROUP = 11;
Vorp.PLASMA_PROBE_GROUP = 12;
Vorp.PLASMA_GROUP = 13;
Vorp.TRACTOR_BEAM_GROUP = 14;

Vorp.COLLIDER_GROUP_PAIRS = [
  [Vorp.EMPTY_GROUP, Vorp.EMPTY_GROUP],
  [Vorp.NO_HIT_GROUP, Vorp.EMPTY_GROUP],

  [Vorp.MONSTER_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.MONSTER_GROUP, Vorp.MONSTER_GROUP],

  [Vorp.WALL_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.WALL_GROUP, Vorp.MONSTER_GROUP],

  [Vorp.GENERAL_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.GENERAL_GROUP, Vorp.MONSTER_GROUP],
  [Vorp.GENERAL_GROUP, Vorp.WALL_GROUP],
  [Vorp.GENERAL_GROUP, Vorp.GENERAL_GROUP],

  [Vorp.ZAPPER_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.ZAPPER_GROUP, Vorp.MONSTER_GROUP],

  [Vorp.PORTAL_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.MONSTER_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.WALL_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.GENERAL_GROUP],
  [Vorp.PORTAL_GROUP, Vorp.PORTAL_GROUP],

  [Vorp.PORTAL_PROBE_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.MONSTER_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.WALL_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.GENERAL_GROUP],
  [Vorp.PORTAL_PROBE_GROUP, Vorp.PORTAL_GROUP],

  [Vorp.PORTAL_REPEL_GROUP, Vorp.WALL_GROUP],

  [Vorp.GRIP_BLOCKER_GROUP, Vorp.WALL_GROUP],

  [Vorp.PLASMA_PROBE_GROUP, Vorp.ZAPPER_GROUP],

  [Vorp.PLASMA_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.PLASMA_GROUP, Vorp.MONSTER_GROUP],
  [Vorp.PLASMA_GROUP, Vorp.WALL_GROUP],
  [Vorp.PLASMA_GROUP, Vorp.GENERAL_GROUP],
  [Vorp.PLASMA_GROUP, Vorp.PORTAL_GROUP],

  [Vorp.TRACTOR_BEAM_GROUP, Vorp.PLAYER_GROUP],
  [Vorp.TRACTOR_BEAM_GROUP, Vorp.MONSTER_GROUP],
  [Vorp.TRACTOR_BEAM_GROUP, Vorp.WALL_GROUP],
  [Vorp.TRACTOR_BEAM_GROUP, Vorp.GENERAL_GROUP],
  [Vorp.TRACTOR_BEAM_GROUP, Vorp.PORTAL_GROUP]
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

Vorp.createVorp = function(vorpOut, gameClock, sledgeInvalidator) {
  var collider = new CellCollider(
      Vorp.CELL_SIZE, Vorp.COLLIDER_GROUP_PAIRS, gameClock);
  var wham = new VorpWham();
  var phy = new Phy(collider, gameClock, sledgeInvalidator);
  var vorp = new Vorp(vorpOut, phy, wham, gameClock, sledgeInvalidator);
  phy.setOnSpriteHit(vorp, vorp.onSpriteHit);
  return vorp;
};

Vorp.prototype.setEditable = function(editable) {
  this.editable = editable;
  this.vorpOut.setEditable(editable);
}

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
  var left;
  if (maxWidth < maxHeight) {
    left = '0';
  } else {
    left = (s.width / 2 - dim / 2);
  }
  this.vorpOut.setCanvasSizeLeftTop(dim, left, headerHeight);
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
    this.vorpOut.addPainter(painter);
  }
  if (sprite instanceof PlayerAssemblerSprite) {
    // Assume there's exactly one PlayerAssembler per level for now.
    /** @type {PlayerAssemblerSprite} */
    this.playerAssembler = sprite;
    this.assemblePlayer();
  }
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
  if (this.playerAssemblyTime && this.now() >= this.playerAssemblyTime) {
    this.assemblePlayer();
    this.playerAssemblyTime = null;
  }
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
 * Draws and repositions the audio listener.
 */
Vorp.prototype.draw = function() {
  var now = this.now();
  if (this.playerSprite) {
    this.playerSprite.getPos(this.cameraPos);
  }
  this.vorpOut.draw(now, this.cameraPos.x, this.cameraPos.y);
};


Vorp.prototype.now = function() {
  return this.gameClock.getTime();
};

Vorp.prototype.getPlayerSprite = function() {
  return this.playerSprite;
};

Vorp.prototype.isPlayerSpriteId = function(id) {
  return !!this.playerSprite && this.playerSprite.id == id
      && (this.playerSprite instanceof PlayerSprite);
};

Vorp.prototype.exitToUrl = function(url) {
  window.location = url;
};

Vorp.prototype.removeSprite = function(id) {
  this.phy.removeSprite(id);
};

Vorp.prototype.getZombieSpriteFactory = function() {
  if (!this.zombieSpriteFactory) {
    this.zombieSpriteFactory = new ZombieSpriteFactory(this.getBaseSpriteTemplate());
  }
  return this.zombieSpriteFactory;
};

Vorp.prototype.splashPortal = function(pos, exiting) {
  // TODO: remove this middleman
  this.vorpOut.splashPortal(pos, exiting);
};

Vorp.prototype.splashPlasma = function(x, y) {
  // TODO: remove this middleman
  this.vorpOut.splashPlasma(x, y);
};

Vorp.prototype.explodePlayer = function() {
  var pos = this.playerSprite.getPos(new Vec2d());
  this.vorpOut.explode(pos.x, pos.y);
  this.playerSprite.die();
  this.removeSprite(this.playerSprite.id);
  this.playerAssemblyTime = this.now() + Vorp.EXPLODED_PLAYER_REASSEMBLY_DELAY;
  this.playerSprite = null;
};

Vorp.prototype.explodeZombie = function(id) {
  var sprite = this.getSprite(id);
  var pos = sprite.getPos(new Vec2d());
  this.vorpOut.explode(pos.x, pos.y);
  sprite.die();
  this.removeSprite(id);
};

Vorp.prototype.createZombieAtXY = function(x, y) {
  var zombieSprite = this.getZombieSpriteFactory().createXY(x, y);
  this.addSprite(zombieSprite);
  zombieSprite.act();
};

Vorp.prototype.playerFullyZombified = function() {
  var playerPos = this.playerSprite.getPos(new Vec2d());
  this.createZombieAtXY(playerPos.x, playerPos.y);

  this.playerSprite.die();
  this.removeSprite(this.playerSprite.id);

  this.playerAssemblyTime = this.now() + Vorp.ZOMBIFIED_PLAYER_REASSEMBLY_DELAY;
};

Vorp.prototype.assemblePlayer = function() {
  this.playerSprite = this.playerAssembler.createPlayer();
  this.addSprite(this.playerSprite);
};

Vorp.prototype.firePlasma = function(px, py, vx, vy) {
  this.splashPlasma(px, py);
  var rad = PlasmaSprite.RADIUS / 2;
  var plasmaSprite = new PlasmaSprite(
    this.getBaseSpriteTemplate()
        .makeMovable()
        .setGroup(Vorp.PLASMA_GROUP)
        .setPainter(new PlasmaPainter())
        .setPosXY(px, py)
        .setVelXY(vx, vy)
        .setRadXY(rad, rad)
        .setMass(0.1 / (rad * rad)));
  this.addSprite(plasmaSprite);
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
  var pos = Vec2d.alloc();
  if (!handled && s1 instanceof PortalSprite && !(s2 instanceof PortalSprite)) {
    handled = s1.onSpriteHit(s2, a1, a2, xTime, yTime, overlapping);
  }
  if (!handled && s2 instanceof PortalSprite && !(s1 instanceof PortalSprite)) {
    handled = s2.onSpriteHit(s1, a2, a1, xTime, yTime, overlapping);
  }
  if (!handled) {
    var vol = 0.005 * (a1.magnitude() * s1.mass);
    if (vol > 0.01) {
      this.vorpOut.tap(s1.getPos(pos), vol);
    }
    var vol = 0.005 * (a2.magnitude() * s2.mass);
    if (vol > 0.01) {
      this.vorpOut.tap(s2.getPos(pos), vol);
    }
    s1.addVel(a1);
    s2.addVel(a2);
    s1.onSpriteHit(s2);
    s2.onSpriteHit(s1);
  }
  Vec2d.free(pos);
};

