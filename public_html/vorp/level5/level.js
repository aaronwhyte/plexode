window['main'] = function() {
  var b = new LevelBuilder();
  b.mark(0, 0, 1600, 500).wall();
  b.mark(1600-250, 250).exit('../level6/index.html');
  var z = b.mark(1000, 0).markY(500).door(true);
  b.mark(700, 0).dir(Prefab.DOWN).grip(
      function(held) {
        z.setClosed(!held);
      });
  b.mark(0, 250).dir(Prefab.RIGHT).playerAssembler(true);
  b.mark(50, 50).block();
  b.mark(50, 100).block();
  b.mark(100, 50).block();
  b.mark(1600-100, 100, 1600-100, 500-100).portals();
  Vorp.start(b, document.getElementById('canvas'), document.getElementById('flags'));
}
