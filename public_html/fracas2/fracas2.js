/**
 * @constructor
 */
function Fracas2(canvas) {
  this.renderer = new Renderer(canvas);

  var now = 1;
  this.cellsX = Math.floor(Fracas2.LEVEL_WIDTH / Fracas2.CELL_SIZE);
  this.cellsY = Math.floor(Fracas2.LEVEL_HEIGHT / Fracas2.CELL_SIZE);
  var collider = this.collider = new CellCollider(
      0, 0,
      this.cellsX, this.cellsY,
      Fracas2.LEVEL_WIDTH / this.cellsX, Fracas2.LEVEL_HEIGHT / this.cellsY,
      [
        [Fracas2.MASS_GROUP, Fracas2.MASS_GROUP],
        [Fracas2.MASS_GROUP, Fracas2.PLAYER_GROUP],
        [Fracas2.MASS_GROUP, Fracas2.PLAYER_BULLET_GROUP],
        [Fracas2.MASS_GROUP, Fracas2.ENEMY_GROUP],
        [Fracas2.WALL_GROUP, Fracas2.MASS_GROUP],
        [Fracas2.WALL_GROUP, Fracas2.PLAYER_GROUP],
        [Fracas2.WALL_GROUP, Fracas2.PLAYER_BULLET_GROUP],
        [Fracas2.WALL_GROUP, Fracas2.ENEMY_GROUP],
        [Fracas2.LOS_SENSOR_GROUP, Fracas2.WALL_GROUP],
        [Fracas2.LOS_SENSOR_GROUP, Fracas2.MASS_GROUP],
        [Fracas2.LOS_SENSOR_GROUP, Fracas2.PLAYER_GROUP],
        [Fracas2.ENEMY_GROUP, Fracas2.ENEMY_GROUP],
        [Fracas2.ENEMY_GROUP, Fracas2.PLAYER_GROUP],
        [Fracas2.ENEMY_GROUP, Fracas2.PLAYER_BULLET_GROUP]
//        [Fracas2.EMPTY_GROUP, Fracas2.PLAYER_GROUP],
//        [Fracas2.EMPTY_GROUP, Fracas2.MASS_GROUP],
//        [Fracas2.EMPTY_GROUP, Fracas2.PLAYER_BULLET_GROUP],
//        [Fracas2.EMPTY_GROUP, Fracas2.LOS_SENSOR_GROUP],      
//        [Fracas2.EMPTY_GROUP, Fracas2.EMPTY_GROUP]
      ],
      now); 
  var wham = new Wham();
  this.phy = new Phy(collider, wham, now);
  
  this.playerPos = new Vec2d();
  this.playerVel = new Vec2d();

  this.initSprites();
}

Fracas2.EMPTY_GROUP = 1;
Fracas2.MASS_GROUP = 2;
Fracas2.PLAYER_GROUP = 3;
Fracas2.PLAYER_BULLET_GROUP = 4;
Fracas2.WALL_GROUP = 5;
Fracas2.LOS_SENSOR_GROUP = 6;
Fracas2.ENEMY_GROUP = 7;

Fracas2.LEVEL_WIDTH = 2000;
Fracas2.LEVEL_HEIGHT = 2000;
Fracas2.CELL_SIZE = 100;


Fracas2.prototype.initSprites = function() {
  var sprite;

  // Walls
  var thickness = 4;
  this.addWall(0, 0, Fracas2.LEVEL_WIDTH, thickness);
  this.addWall(Fracas2.LEVEL_WIDTH - thickness, 0, Fracas2.LEVEL_WIDTH, Fracas2.LEVEL_HEIGHT);
  this.addWall(0, Fracas2.LEVEL_HEIGHT - thickness, Fracas2.LEVEL_WIDTH, Fracas2.LEVEL_HEIGHT);
  this.addWall(0, 0, thickness, Fracas2.LEVEL_HEIGHT);
  
  var wallyness = 0.3;
  var divs = 11;
  var w = Fracas2.LEVEL_WIDTH-thickness;
  var h = Fracas2.LEVEL_HEIGHT-thickness;
  for (var x = 0; x < divs; x++) {
    for (var y = 0; y < divs; y++) {
      // to the right
      var x0 = x * w / divs;
      var y0 = y * h / divs;
      if (Math.random() < wallyness) {
        this.addWall(x0, y0, x0 + w / divs + thickness, y0 + thickness);
      }
      if (Math.random() < wallyness) {
        this.addWall(x0, y0, x0 + thickness, y0 + h / divs + thickness);
      }
    }
  }
  
  // Boulders
  for (var i = 0; i < 40; i++) {
    var rx = Math.random() * 12 + 10;
    var ry = Math.random() * 12 + 10;
    var sprite = new BoulderSprite(
        this.phy,
        Math.random() * Fracas2.LEVEL_WIDTH, Math.random() * Fracas2.LEVEL_HEIGHT,
        (Math.random() -0.5) * 1000, (Math.random() -0.5) * 1000,
        rx, ry,
        rx * ry * 10,
        Fracas2.MASS_GROUP);
    this.phy.addSprite(sprite);
  }
  
  // Followers
  for (var i = 0; i < 50; i++) {
    var r = 5 + Math.random() * 10;
    var sprite = new FollowerSprite(
        this.phy,
        (1/4 + Math.random()) * Fracas2.LEVEL_WIDTH / 2,
        (1/4 + Math.random()) * Fracas2.LEVEL_HEIGHT / 2,
        (Math.random() -0.5) * 100,
        (Math.random() -0.5) * 100,
        r, r,
        r * r,
        Fracas2.ENEMY_GROUP);
    this.phy.addSprite(sprite);
  }
  
  // Player
  this.playerSprite = new PlayerSprite(
      this.phy,
      3 * Fracas2.LEVEL_WIDTH / 4, 3 * Fracas2.LEVEL_HEIGHT / 4,
      0, 0,
      8, 8,
      8 * 8,
      Fracas2.PLAYER_GROUP);
  this.playerId = this.phy.addSprite(this.playerSprite);
};

Fracas2.prototype.addWall = function(x0, y0, x1, y1) {
  var sprite = new WallSprite(
      this.phy,
      (x0 + x1) / 2, (y0 + y1) / 2,
      0, 0,
      (x1 - x0) / 2, (y1 - y0) / 2,
      Infinity,
      Fracas2.WALL_GROUP);
  this.phy.addSprite(sprite);
};

/**
 * Draws to the canvas.
 */
Fracas2.prototype.draw = function() {
  var plr = this.phy.sprites[this.playerId];

  this.renderer.start(1, plr.px, plr.py);
  for (var spriteId in this.phy.sprites) {
    var sprite = this.phy.sprites[spriteId];
    sprite.draw(this.renderer, this.getNow());
  }
  //this.renderer.drawGrid(0, 0, Fracas2.LEVEL_WIDTH, Fracas2.LEVEL_HEIGHT, this.cellsX, this.cellsY);
  this.collider.draw(this.renderer);
  this.renderer.end();
};

/**
 * Moves time forward by one and then draws.
 */
Fracas2.prototype.clock = function() {
  for (var id in this.phy.sprites) {
    var sprite = this.phy.sprites[id];
    sprite.act(this);
  }
  this.phy.clock(1);
  this.draw();
};

Fracas2.prototype.getNow = function() {
  return this.phy.now;
};

Fracas2.prototype.getPlayerSprite = function() {
  return this.playerSprite;
};
