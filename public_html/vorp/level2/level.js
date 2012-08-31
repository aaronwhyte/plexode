window['main'] = function() {
  var ed = LevelProg.create();
  ed.wallStart(0, 0).wallToX(1600).wallToY(500).wallToX(0).wallToY(0);
  ed.mono(VedType.PLAYER_ASSEMBLER, 50, 250);
  ed.double(VedType.PORTAL, 400, 150, 700, 350);
  ed.mono(VedType.EXIT, 1600-250, 250, {'url': '../level3/index.html'});

  var zapperPos = new Vec2d(1000, 50);
  ed.mono(VedType.ZAPPER, zapperPos.x, zapperPos.y);

  var buttonPos = new Vec2d(900, 50);
  ed.mono(VedType.BUTTON, buttonPos.x, buttonPos.y);
  // TODO: toggle sprite

  ed.selectNearest(zapperPos, true);
  ed.selectNearest(buttonPos, true);
  ed.linkSelectedJacks();

  ed.startVorp(document.getElementById('canvas'));
};
