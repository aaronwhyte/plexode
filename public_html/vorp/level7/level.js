window['main'] = function() {
  var b = new LevelBuilder();
  b.scale(230);
  room1(b);
  room2(b);
  
//  var z1 = b.mark(9, 6, 9, 7).zapper(true);
//  b.mark(8.5, 6).dir(Prefab.DOWN).button(
//      function() {
//        z1.setActive(!z1.active);
//      });
//  var z2 = b.mark(11, 8.5, 12, 8.5).zapper(true);
//  b.mark(11, 9).dir(Prefab.RIGHT).button(
//      function() {
//        z2.setActive(!z2.active);
//      });
//  var z3 = b.mark(11, 10, 12, 10).zapper(true);
//  b.mark(11.5, 12).dir(Prefab.UP).button(
//      function() {
//        z3.setActive(!z3.active);
//      });
//  var z4 = b.mark(13, 11, 13, 12).zapper(true);
//  b.mark(13, 12.5).dir(Prefab.LEFT).button(
//      function() {
//        z4.setActive(!z4.active);
//      });
//  b.mark(6.5, 6.5).player();
//  b.mark(1, 4, 2, 4).zapper(true);
//  b.mark(4, 6, 4, 7).zapper(true);
//  b.mark(12.5, 5.5).block();
//  b.mark(12.5, 6).block();
//  b.mark(12.5, 6.5).block();
//  b.mark(14.5, 11.5, 12, 12.5).portals();
//  b.mark(1.5, 1.5).exit('../level4/index.html');
  Vorp.start(b, document.getElementById('canvas'), document.getElementById('flags'));
}

function room1(b) {
  b.mark(
      5, 1,
      4, 1,
      4, 0,
      1, 0,
      1, 1,
      0, 1,
      0, 2,
      1, 2,
      1, 3,
      4, 3,
      4, 2,
      5, 2).wall();
  var d1 = b.mark(4, 1, 4, 2).door(true);
  var d2 = b.mark(4.2, 1, 4.2, 2).door(true);
  var b1 = b.mark(4, 0.8).dir(Prefab.LEFT).button(
      function() {
        d1.setClosed(!d1.closed);
      });
  var b2 = b.mark(4, 2.2).dir(Prefab.LEFT).button(
      function() {
        d2.setClosed(!d2.closed);
      });
  b.mark(0.5, 1.5).player();
}

function room2(b) {
  b.save();
  b.translate(5, 2);
  b.mark(
      6, 1,
      4, 1,
      4, 0,
      1, 0,
      1, 1,
      0, 1,
      0, 2,
      1, 2,
      1, 3,
      4, 3,
      4, 2,
      6, 2).wall();
  var d1 = b.mark(4, 1, 4, 2).door(true);
  var d2 = b.mark(4.2, 1, 4.2, 2).door(true);
  var b1 = b.mark(4, 0.8).dir(Prefab.LEFT).button(
      function() {
        d1.setClosed(!d1.closed);
      });
  var b2 = b.mark(4, 2.2).dir(Prefab.LEFT).button(
      function() {
        d2.setClosed(!d2.closed);
      });
  b.restore();
}