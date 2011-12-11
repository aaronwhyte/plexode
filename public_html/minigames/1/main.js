window.FLAGS = null;

function main() {
  var canvas = document.getElementById('canvas');
  var b = new LevelBuilder();
  Game.start(b, canvas);
}
