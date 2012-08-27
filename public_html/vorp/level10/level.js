window['main'] = function() {
  var model = new GrafModel();
  var sysClipList = SysClipListBuilder.createDefaultInstance();
  var ed = new LevelEd(model);

  /**
   * @param tuples An array of [objId, key, value] arrays.
   */
  function pasteWithPositions(type, pos1, pos2, opt_dataTuples) {
    var idMap = ed.pasteWithPositions(
        sysClipList.getClipById(type).grafModel,
        [pos1, pos2]);
    if (opt_dataTuples) {
      setData(opt_dataTuples, idMap);
    }
  }

  /**
   * @param tuples An array of [objId, key, value] arrays.
   */
  function pasteWithOffset(type, offset, opt_dataTuples) {
    var idMap = ed.pasteWithOffset(sysClipList.getClipById(type).grafModel, offset);
    if (opt_dataTuples) {
      setData(opt_dataTuples, idMap);
    }
  }

  /**
   * @param tuples An array of [objId, key, value] arrays.
   */
  function setData(tuples, opt_idMap) {
    for (var i in tuples) {
      var tuple = tuples[i];
      var objId = opt_idMap ? opt_idMap[tuple[0]] : tuple[0];
      var key = tuple[1];
      var val = tuple[2];
      ed.setData(objId, key, val);
    }
  }

  function link(outputPartPos, inputPartPos) {
    ed.clearSelection();
    var outputJackId = ed.getNearestId(ed.getJackOffset(false).add(outputPartPos));
    ed.select(outputJackId, true);
    var inputJackId = ed.getNearestId(ed.getJackOffset(true).add(inputPartPos));
    ed.select(inputJackId, true);
    ed.linkSelectedJacks();
  }

  function v(x, y) {
    return new Vec2d(x, y);
  }

  function wall(x1, y1, x2, y2) {
    pasteWithPositions(VedType.WALL, v(x1, y1), v(x2, y2));
  }

  function mono(type, x1, y1, opt_tuples) {
    pasteWithOffset(type, v(x1, y1), opt_tuples);
  }

  wall(-400, 0, -400, 400);
  wall(0, 0, 500, 0);
  wall(0, 0, 0, 400);
  wall(400, 400, 800, 400);
  wall(400, 800, 800, 800);
  mono(VedType.PLAYER_ASSEMBLER, 50, 200);

  mono(VedType.GRIP, 600, 600);
  mono(VedType.DOOR, 700, 700);
  link(new Vec2d(600, 600), new Vec2d(700, 700));

  mono(VedType.BLOCK, -100, 200);
  mono(VedType.BLOCK, -100, 300);
  mono(VedType.BLOCK, -100, 400);
  mono(VedType.EXIT, 600, 200, [[2, 'url', '../level10']]);
  mono(VedType.PORTAL, 300, 600);

  var renderer = new Renderer(document.getElementById('canvas'), new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(model);
  vorp.startLoop();
};
