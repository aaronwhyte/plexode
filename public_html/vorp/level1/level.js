var vorpLevels = vorpLevels || {};
(function() {
  var ed = LevelProg.create();
  ed.wallStart(0, 0).wallToX(2000).wallToY(2000).wallToX(0).wallToY(0);
  ed.wallStart(1000, 500).wallToY(1500);
  ed.wallStart(500, 1000).wallToX(1500);
  ed.double(VedType.PORTAL, 300, 500, 500, 300);
  ed.mono(VedType.PLAYER_ASSEMBLER, 50, 200);
  ed.mono(VedType.EXIT, 1940, 1940, {'url': '../level2/index.html'});
  for (var x = 1050; x <= 1950; x += 60) {
    for (var y = 1050; y <= 1950; y += 60) {
      if (x >= 1900 && y >= 1900) continue;
      ed.mono(VedType.BLOCK, x, y);
    }
  }
  vorpLevels['level 1: first one ever!'] = ed.createOps();
})();
