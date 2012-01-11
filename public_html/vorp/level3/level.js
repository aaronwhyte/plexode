window['main'] = function() {
  var b = new LevelBuilder();
  b.scale(230);
  b.mark(
    11, 12,
    11, 8,
    10, 8,
    10, 7,
    8, 7,
    8, 8,
    5, 8,
    5, 7,
    3, 7,
    3, 8,
    0, 8,
    0, 5,
    1, 5,
    1, 3,
    0, 3,
    0, 0,
    3, 0,
    3, 3,
    2, 3,
    2, 5,
    3, 5,
    3, 6,
    5, 6,
    5, 5,
    8, 5,
    8, 6,
    10, 6,
    10, 5,
    13, 5,
    13, 8,
    12, 8,
    12, 10,
    13, 10,
    13, 11,
    15, 11,
    15, 14,
    11, 14,
    11, 12,
    13, 12,
    13, 13).wall();
  var z1 = b.mark(9, 6, 9, 7).zapper(true);
  b.mark(8.5, 6).dir(Prefab.DOWN).button(
      function() {
        z1.setActive(!z1.active);
      });
  var z2 = b.mark(11, 8.5, 12, 8.5).zapper(true);
  b.mark(11, 9).dir(Prefab.RIGHT).button(
      function() {
        z2.setActive(!z2.active);
      });
  var z3 = b.mark(11, 10, 12, 10).zapper(true);
  b.mark(11.5, 12).dir(Prefab.UP).button(
      function() {
        z3.setActive(!z3.active);
      });
  var z4 = b.mark(13, 11, 13, 12).zapper(true);
  b.mark(13, 12.5).dir(Prefab.LEFT).button(
      function() {
        z4.setActive(!z4.active);
      });
  b.mark(6.5, 8).dir(Prefab.UP).playerAssembler(true);
  b.mark(1, 4, 2, 4).zapper(true);
  b.mark(4, 6, 4, 7).zapper(true);
  b.mark(12.5, 5.5).block();
//  b.mark(12.5, 6).block();
//  b.mark(12.5, 6.5).block();
  b.mark(14.5, 11.5, 12, 12.5).portals();
  b.mark(1.5, 1.5).exit('../level4/index.html');
  Vorp.startWithLevelBuilder(
      b, document.getElementById('canvas'), document.getElementById('flags'));
}
