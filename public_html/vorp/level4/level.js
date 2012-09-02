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

  wallStart(0, 0);
  wx(7);
  wy(4);
  wx(5);
  wy(2);
  wx(0);
  wy(0);

  double(VedType.PORTAL, 2, 0.5, 4, 1.5);
  mono(VedType.PLAYER_ASSEMBLER, 0.2, 1);
  mono(VedType.EXIT, 6, 3, {'url': '../level5/index.html'});

  var beamPos = mono(VedType.BEAM_SENSOR, 2.5, 1);
  var timerPos = mono(VedType.TIMER, 3, 2, {'timeout': 40});
  var doorPos = mono(VedType.DOOR, 3.5, 1);
  ed.link(beamPos, timerPos);
  ed.link(timerPos, doorPos);

  mono(VedType.BLOCK, 0.5, 0.5);
  mono(VedType.BLOCK, 5.5, 0.5);

  ed.startVorp(document.getElementById('canvas'));
};