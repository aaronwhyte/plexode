/**
 * One per Vorp instance. This is in charge of rendering and sound.
 * It manages the list of Painter objects, removing kaput ones, and visiting the rest to do rendering.
 * It also manages the list of Singer objects, removing kaput ones, and visiting the rest to adjust sounds.
 * @param {Renderer} renderer
 * @param {SoundFx} soundFx
 * @constructor
 */
function VorpOut(renderer, soundFx) {
  this.renderer = renderer;
  this.soundFx = soundFx;
  this.painters = [];
  this.singers = [];

  this.canvasSize = -1;
  this.editable = false;

  this.vec = new Vec2d();
}

VorpOut.prototype.setEditable = function(editable) {
  this.editable = editable;
};

VorpOut.prototype.r = function(x) {
  var f = 0.3;
  return x += x * f * (Math.random() - f/2);
};

VorpOut.prototype.setCanvasSizeLeftTop = function(size, left, top) {
  var canvas = this.renderer.canvas;
  canvas.width = size;
  canvas.height = size;
  canvas.style.left = left + 'px';
  canvas.style.top = top + 'px';
  this.canvasSize = size;
};

/**
 * @param {Painter} painter
 */
VorpOut.prototype.addPainter = function(painter) {
  this.painters.push(painter);
};

/**
 * @param {Singer} singer
 */
VorpOut.prototype.addSinger = function(singer) {
  this.singers.push(singer);
};

/**
 * Paints with the painters and sings with the singers, and cleans out the kaput ones.
 */
VorpOut.prototype.draw = function(now, cameraX, cameraY) {
  this.renderer.clear();
  if (!this.editable) {
    this.renderer.setZoom(Vorp.ZOOM * this.canvasSize / 600);
    this.renderer.setCenter(cameraX, cameraY);
    this.soundFx && this.soundFx.setCenter(cameraX, cameraY);
  }

  // Tell painters to advance. Might as well remove any that are kaput.
  // (The timing of isKaput() returning true isn't critical;
  // it doesn't have to be decided during advance().)
  for (var i = 0; i < this.painters.length; i++) {
    var painter = this.painters[i];
    if (painter.isKaput()) {
      var popped = this.painters.pop();
      if (i < this.painters.length) {
        this.painters[i] = popped;
        i--;
      } // else we're trying to remove the final one
    } else {
      painter.advance(now);
    }
  }

  this.drawWorld();

  if (!this.editable) {
    this.renderer.stats();
  }

  // Tell singers to advance. Remove any that are kaput.
  // (The timing of isKaput() returning true isn't critical;
  // it doesn't have to be decided during advance().)
  for (var i = 0; i < this.singers.length; i++) {
    var singer = this.singers[i];
    if (singer.isKaput()) {
      var popped = this.singers.pop();
      if (i < this.singers.length) {
        this.singers[i] = popped;
        i--;
      } // else we're trying to remove the final one
    } else {
      singer.advance(now);
    }
  }

  if (!this.editable) {
    this.singWorld();
  }

};

VorpOut.prototype.drawWorld = function() {
  this.renderer.transformStart();
  for (var i = 0; i < Vorp.LAYERS.length; i++) {
    this.drawLayer(Vorp.LAYERS[i]);
  }
  if (this.editable) {
    this.drawLayer(Vorp.LAYER_EDIT);
  }
  this.renderer.transformEnd();
};

VorpOut.prototype.drawLayer = function(layer) {
  for (var i = 0; i < this.painters.length; i++) {
    var painter = this.painters[i];
    painter.paint(this, layer);
  }
};

VorpOut.prototype.singWorld = function() {
  for (var i = 0; i < this.singers.length; i++) {
    this.singers[i].sing(this);
  }
};

VorpOut.prototype.setLineWidth = function(w) {
  this.renderer.context.lineWidth = w;
};

VorpOut.prototype.setStrokeStyle = function(style) {
  this.renderer.setStrokeStyle(style);
};

VorpOut.prototype.drawLineXYXY = function(x0, y0, x1, y1) {
  this.renderer.drawLineXYXY(x0, y0, x1, y1);
};

VorpOut.prototype.setFillStyle = function(style) {
  this.renderer.setFillStyle(style);
};

VorpOut.prototype.fillRectPosXYRadXY = function(x, y, rx, ry) {
  this.renderer.fillRectPosXYRadXY(x, y, rx, ry);
};

VorpOut.prototype.beginPath = function() {
  this.renderer.context.beginPath();
};

VorpOut.prototype.lineTo = function(x, y) {
  this.renderer.context.lineTo(x, y);
};

VorpOut.prototype.moveTo = function(x, y) {
  this.renderer.context.moveTo(x, y);
};

VorpOut.prototype.stroke = function() {
  this.renderer.context.stroke();
};

VorpOut.prototype.splashPortal = function(pos, exiting) {
  var painter = new PortalSplashPainter(exiting);
  painter.setPosition(pos.x, pos.y);
  this.addPainter(painter);
  var attack, decay, freq1, freq2;
  if (exiting) {
    attack = 0.2;
    decay = 0.001;
    freq1 = this.r(50);
    freq2 = this.r(2000);
  } else {
    attack = 0.001;
    decay = 0.2;
    freq1 = this.r(2000);
    freq2 = this.r(50);
  }
  this.soundFx && this.soundFx.sound(pos, 0.2, attack, decay, freq1, freq2, 'square');
};


VorpOut.prototype.splashPlasma = function(x, y) {
  var painter = new PlasmaSplashPainter();
  painter.setPosition(x, y);
  this.addPainter(painter);
};


VorpOut.prototype.explode = function(x, y) {
  var painter = new ExplosionPainter();
  painter.setPosition(x, y);
  this.addPainter(painter);

  this.vec.setXY(x, y);
  var decay = Math.random() * 0.3 + 0.3;
  for (var i = 0; i < 3; i++) {
    var attack = 0.001;
    var freq1 = (Math.random() * 200 + 100);
    var freq2 = 1;
    this.soundFx && this.soundFx.sound(this.vec, 0.3, attack, decay, freq1, freq2, 'square');
  }
};


VorpOut.prototype.tap = function(pos, vol) {
  this.soundFx && this.soundFx.sound(pos, vol, 0, 0.005, this.r(1000), this.r(2000), 'square');
  this.soundFx && this.soundFx.sound(pos, vol, 0, 0.01, this.r(2000), this.r(1000), 'sine');
};


VorpOut.prototype.assemblePlayerNoise = function(pos) {
  if (!this.soundFx) return;
  this.soundFx.sound(pos, 0.09,
      0.1, 0.001,
      50, 1000,
      'sine', 0);
  this.soundFx.sound(pos, 0.09,
      0.11, 0.001,
      50, 2000,
      'sine', 0);
  this.soundFx.sound(pos, 0.06,
      0.12, 0.005,
      50, 4000,
      'sine', 0.015);
  this.soundFx.sound(pos, 0.03,
      0.14, 0.1,
      50, 8000,
      'sine', 0.03);
};
