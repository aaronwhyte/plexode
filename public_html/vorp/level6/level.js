var vorpLevels = vorpLevels || {};
(function() {
  var SCALE = 230;
  var translation = new Vec2d();

  function wallStart(x, y) {
    x += translation.x;
    y += translation.y;
    return ed.wallStart(x * SCALE, y * SCALE);
  }

  function wx(x) {
    x += translation.x;
    return ed.wallToX(x * SCALE);
  }

  function wy(y) {
    y += translation.y;
    return ed.wallToY(y * SCALE);
  }

  function mono(type, x, y, opt_data) {
    x += translation.x;
    y += translation.y;
    return ed.mono(type, x * SCALE, y * SCALE, opt_data)
  }

  function dual(type, x1, y1, x2, y2, opt_data) {
    x1 += translation.x;
    y1 += translation.y;
    x2 += translation.x;
    y2 += translation.y;
    return ed.double(type, x1 * SCALE, y1 * SCALE, x2 * SCALE, y2 * SCALE, opt_data)
  }

  var ed = LevelProg.create();

  // room 0
  translation.setXY(0, 0);
  wallStart(3, 6);
  wy(4);
  wx(4);
  wy(1);
  wx(1);
  wy(4);
  wx(2);
  wy(6);
  mono(VedType.PLAYER_ASSEMBLER, 2.5, 1.2);
  mono(VedType.BLOCK, 3.6, 3.4);

  // room 1
  translation.setXY(1, 6);
  wallStart(1, 0);
  wx(0);
  wy(3);
  wx(2);
  wy(4);
  wallStart(2, 0);
  wx(3);
  wy(4);
  ed.link(
      mono(VedType.GRIP, 1, 2.8),
      mono(VedType.DOOR, 2.5, 3)
  );

  // room 2
  translation.setXY(2, 10);
  wallStart(1, 0);
  wy(1);
  wx(0);
  wy(4);
  wx(1);
  wy(7);
  wx(5);
  wallStart(2, 0);
  wy(1);
  wx(3);
  wy(4);
  wx(2);
  wy(6);
  wx(5);
  wallStart(0, 2.15);
  wx(0.65);
  wallStart(0, 2.85);
  wx(0.65);
  var outDoor = mono(VedType.DOOR, 1.5, 4);
  var gripDoor = mono(VedType.DOOR, 0.6, 2.5);
  var leftGrip = mono(VedType.GRIP, 0.2, 2.5);
  var rightGrip = mono(VedType.GRIP, 2.8, 2.5);
  ed.link(leftGrip, gripDoor);
  ed.link(rightGrip, gripDoor);
  ed.link(leftGrip, outDoor);
  mono(VedType.BLOCK, 3 - 0.4, 2.5);

  // room 3
  translation.setXY(7, 14);
  wallStart(0, 2);
  wx(1);
  wy(1);
  wx(4);
  wy(4);
  wx(1);
  wy(3);
  wx(0);
  wallStart(4.5, 0);
  wy(4);
  wx(7.5);
  wy(1);
  wx(5.5);
  wy(0);
  dual(VedType.PORTAL, 2.5, 2.5, 6, 2.5);
  mono(VedType.BLOCK, 3.5, 1.5);
  function gripAndDoor(gx, gy, dx, dy) {
    ed.link(
        mono(VedType.GRIP, gx, gy),
        mono(VedType.DOOR, dx, dy));
  }
  gripAndDoor(5.5, 3.8, 5, 0.6);
  gripAndDoor(6.5, 3.8, 5, 0.2);
  gripAndDoor(7.3, 3.0, 5, -0.2);
  gripAndDoor(7.3, 2.0, 5, -0.6);

  // room 4
  translation.setXY(10.5, 10);
  wallStart(1, 4);
  wy(3);
  wx(0);
  wy(0);
  wx(3);
  wy(3);
  wx(2);
  wy(4);
  mono(VedType.EXIT, 1.5, 1.5, {'url': '../level1/index.html'});

  vorpLevels['level6'] = ed.createOps();
})();
