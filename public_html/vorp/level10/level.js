window['main'] = function() {
  var ed = LevelProg.create();

  ed.wall(-400, 0, -400, 400);
  ed.wall(0, 0, 500, 0);
  ed.wall(0, 0, 0, 400);
  ed.wall(400, 400, 800, 400);
  ed.wall(400, 800, 800, 800);
  ed.mono(VedType.PLAYER_ASSEMBLER, 50, 200);

  ed.link(
      ed.mono(VedType.GRIP, 600, 600),
      ed.mono(VedType.DOOR, 700, 700));

  ed.mono(VedType.BLOCK, -100, 200);
  ed.mono(VedType.BLOCK, -100, 300);
  ed.mono(VedType.BLOCK, -100, 400);
  ed.mono(VedType.EXIT, 600, 200, {'url': '../level10#You found the exit after ' + new Date()});
  ed.mono(VedType.PORTAL, 300, 600);

  ed.startVorp(document.getElementById('canvas'));
};
