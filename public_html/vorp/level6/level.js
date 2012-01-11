window['main'] = function() {
  var b = new LevelBuilder();
  b.scale(230);

  function placeRoom(x, y, fn) {
    b.save();
    b.translate(x, y);
    fn(b);
    b.restore();
  }
  
  placeRoom(0, 0, room0);
  placeRoom(1, 6, room1);
  placeRoom(2, 10, room2);
  placeRoom(7, 14, room3);
  placeRoom(10.5, 10, room4);

  Vorp.startWithLevelBuilder(
      b, document.getElementById('canvas'), document.getElementById('flags'));
};

function room0(b) {
  b.mark(2.5, 1).dir(Prefab.DOWN).playerAssembler(true);
  b.mark(
      3, 6,
      3, 4,
      4, 4,
      4, 1,
      1, 1,
      1, 4,
      2, 4,
      2, 6).wall();
  b.mark(3.6, 3.4).block();
}

function room1(b) {
  b.mark(
      1, 0,
      0, 0,
      0, 3,
      2, 3,
      2, 4).wall();
  b.mark(
      2, 0,
      3, 0,
      3, 4).wall();
  var d = b.mark(2, 3, 3, 3).door(true);
  b.mark(1, 3).dir(Prefab.UP).grip(
      function(held) {
        d.setClosed(!held);
      });
}

function room2(b) {
  b.mark(
      1, 0,
      1, 1,
      0, 1,
      0, 4,
      1, 4,
      1, 7,
      5, 7).wall();
  b.mark(
      2, 0,
      2, 1,
      3, 1,
      3, 4,
      2, 4,
      2, 6,
      5, 6).wall();

  var outDoor = b.mark(1, 4, 2, 4).door(true);
  b.mark(0, 2.2, 0.6, 2.2).wall();
  b.mark(0, 2.8, 0.6, 2.8).wall();
  var gripDoor = b.mark(0.6, 2.2, 0.6, 2.8).door(false);
  
  var leftGrip = false;
  var rightGrip = false;

  function setGripDoor() {
    gripDoor.setClosed(!leftGrip && !rightGrip);
  }
  b.mark(0, 2.5).dir(Prefab.RIGHT).grip(
      function(held) {
        outDoor.setClosed(!held);
        leftGrip = held;
        setGripDoor();
      });
  b.mark(3, 2.5).dir(Prefab.LEFT).grip(
      function(held) {
        rightGrip = held;
        setGripDoor();
      });
  b.mark(3 - 0.4, 2.5).block();
}

function room3(b) {
  // left walls
  b.mark(
      0, 2,
      1, 2,
      1, 1,
      4, 1,
      4, 4,
      1, 4,
      1, 3,
      0, 3).wall();

  // right walls
  b.mark(
      4.5, 0,
      4.5, 4,
      7.5, 4,
      7.5, 1,
      5.5, 1,
      5.5, 0).wall();

  b.mark(2.5, 2.5, 6, 2.5).portals();
  b.mark(3.5, 1.5).block();
  
  var d1 = b.mark(4.5, 0.6).markX(5.5).door(true);
  var d2 = b.mark(4.5, 0.2).markX(5.5).door(true);
  var d3 = b.mark(4.5, -0.2).markX(5.5).door(true);
  var d4 = b.mark(4.5, -0.6).markX(5.5).door(true);
  
  b.mark(5.5, 4).dir(Prefab.UP).grip(function(held) {
    d1.setClosed(!held);
  });
  b.mark(6.5, 4).dir(Prefab.UP).grip(function(held) {
    d2.setClosed(!held);
  });
  b.mark(7.5, 3).dir(Prefab.LEFT).grip(function(held) {
    d3.setClosed(!held);
  });
  b.mark(7.5, 2).dir(Prefab.LEFT).grip(function(held) {
    d4.setClosed(!held);
  });
}

function room4(b) {
  b.mark(
      1, 4,
      1, 3,
      0, 3,
      0, 0,
      3, 0,
      3, 3,
      2, 3,
      2, 4).wall();
  b.mark(1.5, 1.5).exit('../level1/index.html');
}