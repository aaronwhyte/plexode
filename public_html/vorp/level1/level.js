window['main'] = function() {
  var b = new LevelBuilder();
  b.mark(0, 0).markX(2000).markY(2000).markX(0).markY(0).wall();
  b.mark(1000, 500).markY(1500).wall();
  b.mark(500, 1000).markX(1500).wall();
  b.mark(300, 500, 500, 300).portals();
  b.mark(0, 200).dir(Prefab.RIGHT).playerAssembler(true);
  b.mark(1940, 1940).exit('../level2/index.html');
  for (var x = 1050; x <= 1950; x += 60) {
    for (var y = 1050; y <= 1950; y += 60) {
      if (x >= 1900 && y >= 1900) continue;
      b.mark(x, y).block();
    }
  }
  Vorp.start(b, document.getElementById('canvas'), document.getElementById('flags'));
}
