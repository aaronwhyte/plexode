var vorpLevels = vorpLevels || {};
(function() {
  var ed = LevelProg.create();
  ed.wallStart(0, 0).wallToX(1600).wallToY(500).wallToX(0).wallToY(0);
  ed.mono(VedType.PLAYER_ASSEMBLER, 50, 250);
  ed.double(VedType.PORTAL, 400, 150, 700, 350);
  ed.mono(VedType.EXIT, 1600-250, 250, {'url': '../level3/index.html'});
  var zapperPos = ed.mono(VedType.ZAPPER, 1000, 50);
  var buttonPos = ed.mono(VedType.BUTTON, 900, 50);
  var togglePos = ed.mono(VedType.TOGGLE, 1100, 200);
  ed.link(buttonPos, togglePos);
  ed.link(togglePos, zapperPos);
  vorpLevels['level 2: zapper/button test'] = ed.createOps();
})();
