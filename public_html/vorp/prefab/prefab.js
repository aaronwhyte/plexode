/**
 * @constructor
 */
function Prefab() {
  this.baseSpriteTemplate = null;
}

Prefab.BOX_RADIUS = 20;
Prefab.WALL_RADIUS = 24;
Prefab.UP = new Vec2d(0, -1);
Prefab.RIGHT = new Vec2d(1, 0);
Prefab.DOWN = new Vec2d(0, 1);
Prefab.LEFT = new Vec2d(-1, 0);

Prefab.prototype.createImmovableSpriteTemplate = function() {
  return this.createBaseTemplate()
      .setGroup(Vorp.WALL_GROUP)
      .setMass(Infinity)
      .setSledgeDuration(Infinity);
};

Prefab.prototype.createMovableSpriteTemplate = function() {
  return this.createBaseTemplate()
      .setGroup(Vorp.GENERAL_GROUP)
      .setSledgeDuration(1.01);
};

Prefab.prototype.createBaseTemplate = function() {
  return new SpriteTemplate()
      .setGameClock(this.baseSpriteTemplate.gameClock)
      .setSledgeInvalidator(this.baseSpriteTemplate.sledgeInvalidator)
      .setWorld(this.baseSpriteTemplate.world);
};
