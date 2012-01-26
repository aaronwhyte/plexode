addTest(function transformEmptyModel() {
  var m = new GrafModel();
  var gameClock = new GameClock(1);
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(null, gameClock, sledgeInvalidator);
  var trans = new Transformer(vorp, gameClock, sledgeInvalidator);
  trans.transformModel(m);
});

addTest(function transformWall() {
  var m = new GrafModel();
  var gameClock = new GameClock(1);
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(null, gameClock, sledgeInvalidator);
  var trans = new Transformer(vorp, gameClock, sledgeInvalidator);
  m.applyOps([{
      type: GrafOp.Type.ADD_CLUSTER,
      id: 100
    }, {
      type: GrafOp.Type.SET_DATA,
      id: 100,
      key: 'type',
      value: VedType.WALL
    }, {
      type: GrafOp.Type.ADD_PART,
      id: 101,
      clusterId: 100,
      x: 10, y: 10
    }, {
      type: GrafOp.Type.ADD_PART,
      id: 102,
      clusterId: 100,
      x: 20, y: 10
  }]);
  trans.transformModel(m);
  var sprites = vorp.getSprites();
  assertEquals(1, sprites.length);
  var sprite = sprites[0];
  assertEquals(WallSprite, sprite.constructor);
  assertStringifyEquals(new Vec2d(15, 10), sprite.getPos(new Vec2d()));
  var wr = Transformer.WALL_RADIUS;
  assertStringifyEquals(new Vec2d(wr + 5, wr), sprite.getRad(new Vec2d()));
});
