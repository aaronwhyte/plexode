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

Game.FPS = 45;
Game.ZOOM = 0.35;

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

Game.LEVEL_RADIUS = 1500;
Game.CELL_SIZE = 100;

// Ordered list of paint layers
Game.LAYERS = [
  Game.LAYER_SPARKS = 'sparks',
  Game.LAYER_MASSES = 'masses',
  Game.LAYER_SUPERSPARKS = 'oversparks'
];

Game.start = function(canvas) {
  var renderer = new Renderer(canvas, new Camera());
  var now = 1;
  var levelBoundingRect = {
    x0: -Game.LEVEL_RADIUS, y0: -Game.LEVEL_RADIUS,
    x1: Game.LEVEL_RADIUS, y1: Game.LEVEL_RADIUS
  };
  var collider = new CellCollider(
      levelBoundingRect, Game.CELL_SIZE, Game.COLLIDER_GROUP_PAIRS, now);
  var wham = new GameWham();
  var phy = new Phy(collider, wham, now);
  var game = new Game(renderer, phy);

  game.populateLevel(1);

  GU_start(function(){game.clock();}, Game.FPS);
};

Game.prototype.populateLevel = function(levelNum) {
  var playerSprite = new PlayerSprite(this.phy, 0, 60);
  this.addSprite(playerSprite);
  this.setPlayerSprite(playerSprite);
  var flailSprite = new FlailSprite(this.phy, 0, -60);
  this.addSprite(flailSprite);
  playerSprite.setFlailSprite(flailSprite);

  var arenaRad = Game.LEVEL_RADIUS - 20;
  var wallRad = 15;
  // top
  this.addSprite(new WallSprite(this.phy, 0, -arenaRad, arenaRad + wallRad, wallRad));
  // bottom
  this.addSprite(new WallSprite(this.phy, 0, arenaRad, arenaRad + wallRad, wallRad));
  // left
  this.addSprite(new WallSprite(this.phy, -arenaRad, 0, wallRad, arenaRad + wallRad));
  // right
  this.addSprite(new WallSprite(this.phy, arenaRad, 0, wallRad, arenaRad + wallRad));

//  this.addSprite(new WallSprite(this.phy, 0, -arenaRad/4, arenaRad/8 + wallRad, wallRad));
//  this.addSprite(new WallSprite(this.phy, 0, arenaRad/4, arenaRad/8 + wallRad, wallRad));
//  this.addSprite(new WallSprite(this.phy, -arenaRad/4, 0, wallRad, arenaRad/8 + wallRad));
//  this.addSprite(new WallSprite(this.phy, arenaRad/4, 0, wallRad, arenaRad/8 + wallRad));

  var game = this;

  function plus(x, y) {
    var len = 0.15;
    game.addSprite(new WallSprite(game.phy, x, y, wallRad, arenaRad * len + wallRad));
    game.addSprite(new WallSprite(game.phy, x, y, arenaRad * len + wallRad, wallRad));
  }
  var dist = 0.4;
  plus(dist * arenaRad, dist * arenaRad);
  plus(-dist * arenaRad, dist * arenaRad);
  plus(dist * arenaRad, -dist * arenaRad);
  plus(-dist * arenaRad, -dist * arenaRad);

  function enemy(x, y) {
    game.addSprite(new EnemySprite(game.phy, x + 200 * (Math.random() - 0.5), y  + 200 * (Math.random() - 0.5)));
  }
  dist = 0.75;
  for (var e = 0; e < 25; e++) {
    enemy(dist * arenaRad, dist * arenaRad);
    enemy(-dist * arenaRad, dist * arenaRad);
    enemy(dist * arenaRad, -dist * arenaRad);
    enemy(-dist * arenaRad, -dist * arenaRad);
  }
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
    if (!sprite) continue;
    if (sprite.mass != Infinity) {
      sprite.invalidateSledge();
    }
    sprite.act(this.phy, this);
  }
  for (id in this.phy.sprites) {
    if (!sprite) continue;
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
  this.renderer.setZoom(Game.ZOOM);
  if (this.playerSprite) {
    this.playerSprite.getPos(this.cameraPos);
  }

  // Tell painters to advance. Might as well remove any that are kaput.
  // (The timing of isKaput() returning true isn't critical;
  // it doesn't have to be decided during advance().)
  for (i = 0; i < this.painters.length; i++) {
    painter = this.painters[i];
    if (painter.isKaput()) {
      // remove it
      var popped = this.painters.pop();
      if (i < this.painters.length) {
        this.painters[i] = popped;
        i--;
      }
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
