/**
 * @constructor
 */
function Game(renderer, phy) {
  this.renderer = renderer;
  this.phy = phy;
  
  this.playerSprite = null;
  this.cameraPos = new Vec2d();
  this.painters = [];
}

Game.FPS = 60;

Game.nextGroup = 1;

Game.PLAYER_GROUP = Game.nextGroup++;
Game.PLAYER_FIRE_GROUP = Game.nextGroup++;

Game.ENEMY_GROUP = Game.nextGroup++;
Game.ENEMY_FIRE_GROUP = Game.nextGroup++;

Game.WALL_GROUP = Game.nextGroup++;
Game.GENERAL_GROUP = Game.nextGroup++;

Game.EMPTY_GROUP = Game.nextGroup++;
Game.NO_HIT_GROUP = Game.nextGroup++;

// No friendly-fire collisions.
Game.COLLIDER_GROUP_PAIRS = [
  [Game.PLAYER_GROUP, Game.PLAYER_GROUP],
  [Game.PLAYER_GROUP, Game.ENEMY_GROUP],
  [Game.PLAYER_GROUP, Game.ENEMY_FIRE_GROUP],
  [Game.PLAYER_GROUP, Game.WALL_GROUP],
  [Game.PLAYER_GROUP, Game.GENERAL_GROUP],
  [Game.PLAYER_FIRE_GROUP, Game.ENEMY_GROUP],
  [Game.PLAYER_FIRE_GROUP, Game.ENEMY_FIRE_GROUP],
  [Game.PLAYER_FIRE_GROUP, Game.WALL_GROUP],
  [Game.PLAYER_FIRE_GROUP, Game.GENERAL_GROUP],
  [Game.ENEMY_GROUP, Game.ENEMY_GROUP],
  [Game.ENEMY_GROUP, Game.WALL_GROUP],
  [Game.ENEMY_GROUP, Game.GENERAL_GROUP],
  [Game.WALL_GROUP, Game.GENERAL_GROUP],
  [Game.GENERAL_GROUP, Game.GENERAL_GROUP],

  [Game.EMPTY_GROUP, Game.EMPTY_GROUP],
  [Game.NO_HIT_GROUP, Game.EMPTY_GROUP]
];

Game.CELL_SIZE = 100;

// Ordered list of paint layers
Game.LAYERS = [
  Game.LAYER_SPARKS = 'sparks',
  Game.LAYER_MASSES = 'masses',
  Game.LAYER_SUPERSPARKS = 'oversparks'
];

Game.start = function(levelBuilder, canvas, opt_camera) {
  var camera = opt_camera || new Camera();
  var renderer = new Renderer(canvas, camera);
  var now = 1;
  var collider = new CellCollider(levelBuilder.getBoundingRect(Game.CELL_SIZE),
      Game.CELL_SIZE, Game.COLLIDER_GROUP_PAIRS, now);
  var wham = new GameWham();
  var phy = new Phy(collider, wham, now);
  var game = new Game(renderer, phy);

  var prefabs = levelBuilder.getPrefabs();
  for (var i = 0; i < prefabs.length; i++) {
    var prefab = prefabs[i];
    var sprites = prefab.createSprites(game);
    game.addSprites(sprites);
    if (prefab instanceof PlayerPrefab) {
      game.setPlayerSprite(sprites[0]);
    }
  }
  GU_start(function(){game.clock();}, Game.FPS);
};

Game.prototype.addSprites = function(sprites) {
  for (var i = 0; i < sprites.length; i++) {
    this.addSprite(sprites[i]);
  }
};

/**
 * @param {Sprite} sprite
 */
Game.prototype.addSprite = function(sprite) {
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
Game.prototype.addPainter = function(painter) {
  this.painters.push(painter);
};

/**
 * @param {Sprite} sprite
 */
Game.prototype.setPlayerSprite = function(sprite) {
  this.playerSprite = sprite;
};

/**
 * Moves time forward by one and then draws.
 */
Game.prototype.clock = function() {
  this.phy.clock(1);
  var id, sprite;
  for (id in this.phy.sprites) {
    sprite = this.phy.sprites[id];
    if (sprite.mass != Infinity) {
      sprite.invalidateSledge();
    }
    sprite.act(this.phy, this);
  }
  for (id in this.phy.sprites) {
    sprite = this.phy.sprites[id];
    sprite.affect();
  }
  this.draw();
};

/**
 * Draws to the canvas.
 */
Game.prototype.draw = function() {
  var i, painter;
  var now = this.getNow();
  this.renderer.clear();
  this.renderer.setZoom(0.37);
  if (this.playerSprite) {
    this.playerSprite.getPos(this.cameraPos);
  }

  // Tell painters to advance. Might as well remove any that are kaput.
  // (The timing of isKaput() returning true isn't critical;
  // it doesn't have to be decided during advance().)
  for (i = 0; i < this.painters.length; i++) {
    painter = this.painters[i];
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

  // Center the drawing transform on the normal camera pos - the player.
  this.renderer.setCenter(this.cameraPos.x, this.cameraPos.y);

  // Set up the viewport for player-centered rendering.
  this.drawWorld(true);

  this.renderer.stats();
};

Game.prototype.drawWorld = function(opt_drawColliderDebugging) {
  this.renderer.transformStart();

  // painters paint in layers
  for (var i = 0; i < Game.LAYERS.length; i++) {
    var layer = Game.LAYERS[i];
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

Game.prototype.getNow = function() {
  return this.phy.now;
};

Game.prototype.getPlayerSprite = function() {
  return this.playerSprite;
};

Game.prototype.exitToUrl = function(url) {
  window.location = url;
};

Game.prototype.removeSprite = function(id) {
  this.phy.removeSprite(id);
};

Game.prototype.killPlayer = function() {
  // init dead player using live player's data
  var deadPlayerPrefab = new DeadPlayerPrefab(
      this.playerSprite.px,
      this.playerSprite.py);
  var deadPlayerSprites = deadPlayerPrefab.createSprites(this);
  this.addSprites(deadPlayerSprites);

  // remove normal player sprite
  this.playerSprite.die();
  this.removeSprite(this.playerSprite.id);

  this.playerSprite = deadPlayerSprites[0];
};
