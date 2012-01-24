addTest(function transformEmptyModel() {
  var model = new GrafModel();
  var gameClock = new GameClock(1);
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(null, gameClock, sledgeInvalidator);
  var trans = new Transformer(vorp, gameClock, sledgeInvalidator);
  trans.transformModel(model);
});
