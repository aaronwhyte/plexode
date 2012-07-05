window['main'] = function() {
  function immovable(x, y) {
    return createBaseTemplate()
        .setGroup(Vorp.WALL_GROUP)
        .setMass(Infinity)
        .setSledgeDuration(Infinity)
        .setPosXY(x, y)
        .setRadXY(20, 20);
  }

  function intangible() {
    return createBaseTemplate()
        .setGroup(Vorp.NO_HIT_GROUP)
        .setMass(Infinity)
        .setSledgeDuration(Infinity)
        .setPosXY(0, 0)
        .setRadXY(1, 1);
  }

  function movable(x, y) {
    return createBaseTemplate()
        .setGroup(Vorp.GENERAL_GROUP)
        .setMass(1)
        .setSledgeDuration(1.01)
        .setPosXY(x, y)
        .setRadXY(20, 20);
  }

  function createBaseTemplate() {
    return new SpriteTemplate()
        .setGameClock(gameClock)
        .setSledgeInvalidator(sledgeInvalidator)
        .setWorld(vorp);
  }

  var renderer = new Renderer(document.getElementById('canvas'), new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);

  var assembler = new PlayerAssemblerSprite(immovable(0, 0).setPainter(new PlayerAssemblerPainter()));
  assembler.targetPos.setXY(0, 40);
  vorp.addSprite(assembler);
  vorp.playerAssembler = assembler;

  vorp.addSprite(new BlockSprite(movable(300, 0).setPainter(new RectPainter("#ff0"))));
  vorp.addSprite(new BlockSprite(movable(300, 100).setPainter(new RectPainter("#ff0"))));
  vorp.addSprite(new BlockSprite(movable(300, 200).setPainter(new RectPainter("#ff0"))));

  var button = new ButtonSprite(immovable(200, 200).setPainter(new ButtonPainter()));
  vorp.addSprite(button);

  var timer = new TimerSprite(intangible());
  timer.setTimeoutLength(30);
  vorp.addSprite(timer);

  var doorControl = new DoorControlSprite(intangible());
  var door1 = new DoorSprite(immovable(200, 300).setPainter(new RectPainter("aaa")), 400, 0, 400, 100);
  var door2 = new DoorSprite(immovable(200, 300).setPainter(new RectPainter("aaa")), 400, 200, 400, 100);
  doorControl.addDoorSprite(door1);
  doorControl.addDoorSprite(door2);
  vorp.addSprite(doorControl);
  vorp.addSprite(door1);
  vorp.addSprite(door2);

  vorp.addLogicLink(new LogicLink(
      button.id, button.outputIds.CLICKED,
      timer.id, timer.inputIds.RESTART));
  vorp.addLogicLink(new LogicLink(
      timer.id, timer.outputIds.RUNNING,
      doorControl.id, doorControl.inputIds.OPEN));

  vorp.startLoop();
  vorp.assemblePlayer();
};
