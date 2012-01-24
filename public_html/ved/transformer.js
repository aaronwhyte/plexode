/**
 * Populates a Vorp using a VedModel
 * @param {Vorp} vorp
 * @constructor
 */
function Transformer(vorp, gameClock, sledgeInvalidator) {
  this.vorp = vorp;
  this.gameClock = gameClock;
  this.sledgeInvalidator = sledgeInvalidator;

  // maps jackIds to objects like
  // {
  //   spriteId: id,
  //   type: buffer type enum,
  //   index: num
  // }
  // Gets populated as sprites are created, and used when links are added.
  this.jackMap = {};
}

Transformer.BOX_RADIUS = 20;
Transformer.WALL_RADIUS = 24;
Transformer.UP = new Vec2d(0, -1);
Transformer.RIGHT = new Vec2d(1, 0);
Transformer.DOWN = new Vec2d(0, 1);
Transformer.LEFT = new Vec2d(-1, 0);

Transformer.prototype.createImmovableSpriteTemplate = function() {
  return this.createBaseTemplate()
      .setGroup(Vorp.WALL_GROUP)
      .setMass(Infinity)
      .setSledgeDuration(Infinity);
};

Transformer.prototype.createMovableSpriteTemplate = function() {
  return this.createBaseTemplate()
      .setGroup(Vorp.GENERAL_GROUP)
      .setSledgeDuration(1.01);
};

Transformer.prototype.createBaseTemplate = function() {
  return new SpriteTemplate()
      .setGameClock(this.gameClock)
      .setSledgeInvalidator(this.sledgeInvalidator);
};

Transformer.prototype.mid = function(a, b) {
  return (a + b) / 2;
};

Transformer.prototype.rad = function(a, b, r) {
  return Math.abs(a - b) / 2 + r;
};

/**
 * @param {GrafModel} model  stuff to add to Vorp
 */
Transformer.prototype.transformModel = function(model) {
  var id, cluster;
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.type == VedType.WALL) {
      this.transformWall(model.clusters[id]);
    }
  }
  for (id in model.clusters) {
    cluster = model.clusters[id];
    if (cluster.type != VedType.WALL) {
      this.transformCluster(model.clusters[id]);
    }
  }
  for (id in model.links) {
    this.transformLink(model.links[id]);
  }
};

/**
 * @param {GrafCluster} cluster
 */
Transformer.prototype.transformWall = function(cluster) {
  var parts = [];
  for (var id in cluster.parts) {
    parts.push(cluster.parts[id]);
  }
  if (parts.length != 2) {
    throw Error("Expected 2 parts in a wall cluster, found " + parts.length +
        ", in cluster with id " + cluster.id);
  }
  var x0 = parts[0].x;
  var y0 = parts[0].y;
  var x1 = parts[1].x;
  var y1 = parts[1].y;
  this.vorp.addSprite(new WallSprite(this.createImmovableSpriteTemplate()
      .setPainter(new RectPainter("rgb(80,48,176)"))
      .setPosXY(mid(x0, x1), mid(y0, y1))
      .setRadXY(rad(x0, x1), rad(y0, y1))));
};

/**
 * @param {GrafCluster} cluster
 */
Transformer.prototype.transformCluster = function(cluster) {
};

/**
 * @param {GrafLink} link
 */
Transformer.prototype.transformLink = function(link) {
};
