window['main'] = function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var robogon = new Robogon(300);
  GU_start(function(){
      robogon.clock();
      robogon.draw(c, w, h);
    },
    120);
};