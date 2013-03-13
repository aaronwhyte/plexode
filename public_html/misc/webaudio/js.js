var context, wave;

function initAudioContext() {
  if (context) return context;
  if (typeof AudioContext !== "undefined") {
    return context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    return context = new webkitAudioContext();
  } else {
    throw new Error('AudioContext not supported. :(');
  }
}

SineWave = function(context) {
  var that = this;
  this.x = 0; // Initial sample number
  this.startVanish = 0;
  this.endVanish = 0;
  this.context = context;

//  this.node = context.createJavaScriptNode(1024, 1, 1);
//  this.node.onaudioprocess = function(e) { that.process(e) };
//  this.node = context.createOscillator();
//  this.node.frequency.value = 440;
};

//SineWave.prototype.process = function(e) {
//  var data = e.outputBuffer.getChannelData(0);
//  for (var i = 0; i < data.length; ++i) {
//    this.x++;
//    var vol = 1;
//    if (this.startVanish) {
//      vol = Math.max(0,  (this.endVanish - this.x) / (this.endVanish - this.startVanish));
//    }
//    data[i] = vol * Math.max(-1, Math.min(1,
//        Math.sin(this.x * 0.01) + Math.sin(this.x * 0.0005) + 0*Math.sin(this.x * 0.0031)));
//  }
//  if (this.endVanish && this.x > this.endVanish + 10000) {
//    this.node.disconnect();
//    this.startVanish = 0;
//    this.endVanish = 0;
//    console.log('disconnected');
//  }
//};

SineWave.prototype.play = function() {
  //if (this.node) return;
  this.node = context.createOscillator();
  this.node.frequency.value = 440 * (1 + Math.random());
  this.node.connect(this.context.destination);
  this.node.start(this.context.currentTime);
  this.node.stop(this.context.currentTime + 2);
//  var offTime = 0.5;
//  var that = this;
//  setTimeout(function() {
//    that.node.noteOff(0);
//    that.node.disconnect();
//    that.node = null;
//    console.log('off');
//  }, 1000 * offTime * 1.5);
};

SineWave.prototype.pause = function() {
//  this.startVanish = this.x;
//  this.endVanish = this.x + 10000;
  this.node.noteOff(0);
  this.node.disconnect();
  this.node = null;
}


function main() {
  initAudioContext();
  wave = new SineWave(context);
}

function play() {
  wave.play();
}

function pause() {
  wave.pause();
}