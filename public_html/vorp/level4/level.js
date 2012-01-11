window['main'] = function() {
  var b = new LevelBuilder();
  b.scale(230);

  b.mark(0, 0).markX(7).markY(4).markX(5).markY(2).markX(0).markY(0).wall();

  b.mark(2, 0.5).mark(4, 1.5).portals();
  b.mark(0, 1).dir(Prefab.RIGHT).playerAssembler(true);
  b.mark(6, 3).exit('../level5/index.html');
  
  var door = b.mark(3.5, 0).markY(2).door(true);
  b.mark(2.5, 0).markY(2).beamSensor(function(beamBroken) {
    if (beamBroken) {
      door.setClosed(false);
      timer.stop();
    } else {
      timer.start();
    }
  });
  var timer = b.mark(3, 2).timer(40, function() {
    door.setClosed(true);
  });
 
  b.mark(0.5, 0.5).block();
  b.mark(5.5, 0.5).block();
  Vorp.startWithLevelBuilder(
      b, document.getElementById('canvas'), document.getElementById('flags'));
};