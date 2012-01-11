window['main'] = function() {
  var b = new LevelBuilder();
  b.mark(0, 0).markX(1600).markY(500).markX(0).markY(0).wall();
  b.mark(0, 250).dir(Prefab.RIGHT).playerAssembler(true);
  b.mark(400, 150, 700, 350).portals();
  b.mark(1600-250, 250).exit('../level3/index.html');
  var z = b.mark(1000, 0).markY(500).zapper(true);
  b.mark(900, 0).dir(Prefab.DOWN).button(
      function() {
        z.setActive(!z.active);
      });
  Vorp.startWithLevelBuilder(
      b, document.getElementById('canvas'), document.getElementById('flags'));
}
