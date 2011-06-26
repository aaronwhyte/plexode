window['main'] = function() {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var sparks = new Sparks();
  GU_start(function(){
    sparks.clock();
    sparks.draw(c, w, h);
  },
  60);
};