window['main'] = function() {
  var SCALE = 230;

  function wallStart(x, y) {
    return ed.wallStart(x * SCALE, y * SCALE);
  }

  function wx(x) {
    return ed.wallToX(x * SCALE);
  }

  function wy(y) {
    return ed.wallToY(y * SCALE);
  }

  function mono(type, x, y, opt_data) {
    return ed.mono(type, x * SCALE, y * SCALE, opt_data)
  }

  function double(type, x1, y1, x2, y2, opt_data) {
    return ed.double(type, x1 * SCALE, y1 * SCALE, x2 * SCALE, y2 * SCALE, opt_data)
  }

  var ed = LevelProg.create();
  wallStart(11, 12);
  wy(8);
  wx(10);
  wy(7);
  wx(8);
  wy(8);
  wx(5);
  wy(7);
  wx(3);
  wy(8);
  wx(0);
  wy(5);
  wx(1);
  wy(3);
  wx(0);
  wy(0);
  wx(3);
  wy(3);
  wx(2);
  wy(5);
  wx(3);
  wy(6);
  wx(5);
  wy(5);
  wx(8);
  wy(6);
  wx(10);
  wy(5);
  wx(13);
  wy(8);
  wx(12);
  wy(10);
  wx(13);
  wy(11);
  wx(15);
  wy(14);
  wx(11);
  wy(12);
  wx(13);
  wy(13);

  function buttonToggleZapper(bx, by, tx, ty, zx, zy) {
    var buttonPos = mono(VedType.BUTTON, bx, by);
    var togglePos = mono(VedType.TOGGLE, tx, ty);
    var zapperPos = mono(VedType.ZAPPER, zx, zy);
    ed.link(buttonPos, togglePos);
    ed.link(togglePos, zapperPos);
  }
  buttonToggleZapper(8.5, 6.2, -10, -10, 9, 6.5);
  buttonToggleZapper(11.2, 9, -11, -11, 11.5, 8.5);
  buttonToggleZapper(11.5, 11.8, -12, -12, 11.5, 10);
  buttonToggleZapper(12.8, 12.5, -13, -13, 13, 11.5);
  mono(VedType.PLAYER_ASSEMBLER, 6.5, 7.8);
  mono(VedType.ZAPPER, 1.5, 4);
  mono(VedType.ZAPPER, 4, 6.5);
  mono(VedType.BLOCK, 12.5, 5.5);
  double(VedType.PORTAL, 14.5, 11.5, 12, 12.5);
  mono(VedType.EXIT, 1.5, 1.5, {'url': '../level4/index.html'});

  ed.startVorp(document.getElementById('canvas'));
};
