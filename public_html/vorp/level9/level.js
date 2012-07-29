window['main'] = function() {
  var model = new GrafModel();
  var sysClipList = SysClipListBuilder.createDefaultInstance();

  function movePartId(partId, x, y) {
    var part = model.getPart(partId);
    model.applyOp({
      type: GrafOp.Type.MOVE_PART,
      id: partId,
      oldX: part.x, oldY: part.y,
      x: x, y: y
    });
  }

  function addWall(x0, y0, x1, y1) {
    var ops = sysClipList.getClipById(VedType.WALL).grafModel.createOps();
    var idMap = model.rewriteOpIds(ops);
    model.applyOps(ops);
    movePartId(idMap[2], x0, y0);
    movePartId(idMap[3], x1, y1);
    return model.getCluster(idMap[0]);
  }

  function addSingleWallHugger(type, x, y) {
    var ops = sysClipList.getClipById(type).grafModel.createOps();
    var idMap = model.rewriteOpIds(ops);
    model.applyOps(ops);
    movePartId(idMap[2], x, y);
    return model.getCluster(idMap[0]);
  }

  addWall(0, 0, 400, 0);
  addWall(0, 0, 0, 400);
  addSingleWallHugger(VedType.PLAYER_ASSEMBLER, 201, 200);

  var renderer = new Renderer(document.getElementById('canvas'), new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(model);
  vorp.startLoop();
};
