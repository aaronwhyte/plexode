/**
 * @param {Renderer} renderer
 * @param {SoundFx} soundFx
 * @constructor
 */
function VorpOut(renderer, soundFx) {
  this.renderer = renderer;
  this.soundFx = soundFx;
  this.painters = [];

  this.canvasSize = -1;
  this.editable = false;
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
 * Draws to the canvas.
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

  this.drawWorld(true);

  if (!this.editable) {
    this.renderer.stats();
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
    painter.paint(this.renderer, layer);
  }
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
};


VorpOut.prototype.tap = function(pos, vol) {
  this.soundFx && this.soundFx.sound(pos, vol, 0, 0.005, this.r(1000), this.r(2000), 'square');
  this.soundFx && this.soundFx.sound(pos, vol, 0, 0.01, this.r(2000), this.r(1000), 'sine');
};
