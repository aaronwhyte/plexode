window['main'] = function() {
  var ed = LevelProg.create();
  ed.wallStart(0, 0).wallToX(1600).wallToY(500).wallToX(0).wallToY(0);
  ed.mono(VedType.EXIT, 1600-250, 250, {'url': '../level6/index.html'});
  ed.link(
      ed.mono(VedType.GRIP, 700, 50),
      ed.mono(VedType.DOOR, 1000, 250)
  );
  ed.mono(VedType.PLAYER_ASSEMBLER, 50, 250);
  ed.mono(VedType.BLOCK, 50, 50);
  ed.mono(VedType.BLOCK, 100, 50);
  ed.mono(VedType.BLOCK, 50, 100);
  ed.double(VedType.PORTAL, 1600-100, 100, 1600-100, 500-100);
  ed.startVorp(document.getElementById('canvas'));
};
