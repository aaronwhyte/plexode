function main() {
  var canvas = document.getElementById("canvas");
  var f2 = new Fracas2(canvas);
  GU_start(function(){f2.clock();}, 60);
  //window.onresize = onResize;
  //onResize();
}

function onResize() {
  var size = plex.window.getSize();
  canvas.width = size.width - 40;
  canvas.height = size.height - 80;
}

window['main'] = main;