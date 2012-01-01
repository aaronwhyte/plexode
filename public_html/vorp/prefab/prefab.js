Prefab = {
  BOX_RADIUS: 20,
  WALL_RADIUS: 24,

  UP: new Vec2d(0, -1),
  RIGHT: new Vec2d(1, 0),
  DOWN: new Vec2d(0, 1),
  LEFT: new Vec2d(-1, 0)
};

Prefab.createImmovableSpriteTemplate = function(gameClock, sledgeInvalidator) {
  return new SpriteTemplate()
      .setGameClock(gameClock)
      .setSledgeInvalidator(sledgeInvalidator)
      .setGroup(Vorp.WALL_GROUP)
      .setMass(Infinity)
      .setSledgeDuration(Infinity);
};

Prefab.createMovableSpriteTemplate = function(gameClock, sledgeInvalidator) {
  return new SpriteTemplate()
      .setGameClock(gameClock)
      .setSledgeInvalidator(sledgeInvalidator)
      .setGroup(Vorp.GENERAL_GROUP)
      .setSledgeDuration(1.01);
};