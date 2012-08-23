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
    return model.getCluster(idMap[1]);
  }

  function addMonoPart(type, x, y, opt_data) {
    var clipModel = sysClipList.getClipById(type).grafModel;
    var ops = clipModel.createOps();
    if (opt_data) {
      for (var key in opt_data) {
        ops.push({
          type: GrafOp.Type.SET_DATA,
          id: 2,
          key: key,
          value: opt_data[key],
          oldValue: clipModel.getPart(2).data[key]
        });
      }
    }
    var idMap = model.rewriteOpIds(ops);
    model.applyOps(ops);
    movePartId(idMap[2], x, y);
    return model.getCluster(idMap[1]);
  }

  function addPortals(x1, y1, x2, y2) {
    var ops = sysClipList.getClipById(VedType.PORTAL).grafModel.createOps();
    var idMap = model.rewriteOpIds(ops);
    model.applyOps(ops);
    movePartId(idMap[2], x1, y1);
    movePartId(idMap[3], x2, y2);
    return model.getCluster(idMap[1]);
  }

  function addSimpleLink(outputCluster, inputCluster) {
    function firstJackId(cluster) {
      var part = plex.object.values(cluster.parts)[0];
      var jack = plex.object.values(part.jacks)[0];
      return jack.id;
    }
    var id = model.newId();
    var op = {
      type: GrafOp.Type.ADD_LINK,
      id: id,
      jackId1: firstJackId(outputCluster),
      jackId2: firstJackId(inputCluster)
    };
    model.applyOp(op);
    return model.getLink(id);
  }

  addWall(-400, 0, -400, 400);
  addWall(0, 0, 500, 0);
  addWall(0, 0, 0, 400);
  addWall(400, 400, 800, 400);
  addMonoPart(VedType.PLAYER_ASSEMBLER, 50, 200);
  var buttonCluster = addMonoPart(VedType.BUTTON, 600, 450);
  var gripClusters = [
    addMonoPart(VedType.GRIP, 50, -100),
    addMonoPart(VedType.GRIP, 250, -100),
    addMonoPart(VedType.GRIP, 450, -100)
  ];
  addMonoPart(VedType.BLOCK, -100, 200);
  addMonoPart(VedType.BLOCK, -100, 300);
  addMonoPart(VedType.BLOCK, -100, 400);
  for (var a = 0; a < 4; a++) {
    for (var b = 0; b < 4; b++) {
      addMonoPart(VedType.BLOCK, 100 + a * 50, 800 + b * 50);
    }
  }
  addMonoPart(VedType.EXIT, 600, 200, {'url': '../level10/'});
  var doorCluster1 = addMonoPart(VedType.DOOR, 400, 100);
  var doorCluster2 = addMonoPart(VedType.DOOR, 500, 100);
  var zapperCluster = addMonoPart(VedType.ZAPPER, -100, 0);
  var beamSensorCluster = addMonoPart(VedType.BEAM_SENSOR, -100, 100);
  addPortals(300, 600, -400, -400);
  var timerCluster = addMonoPart(VedType.TIMER, 0, -200, {'timeout': 200});

  addSimpleLink(beamSensorCluster, zapperCluster);
  gripClusters.forEach(function (gripCluster) {
    addSimpleLink(gripCluster, doorCluster1);
  });
  addSimpleLink(buttonCluster, timerCluster);
  addSimpleLink(timerCluster, doorCluster2);

  var renderer = new Renderer(document.getElementById('canvas'), new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(model);
  vorp.startLoop();
};
