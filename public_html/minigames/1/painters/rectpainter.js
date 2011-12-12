/**
 * Basic painter for colored rectangles.
 * @param {string} color
 * @constructor
 * @extends {Painter}
 */
function RectPainter(color) {
  Painter.call(this, 1);
  this.color = color;
  this.kaput = false;
}

RectPainter.prototype = new Painter();
RectPainter.prototype.constructor = RectPainter;

/**
 * @param {string} color
 */
RectPainter.prototype.setColor = function(color) {
  this.color = color;
};

RectPainter.prototype.paint = function(renderer, layer) {
  if (layer == Game.LAYER_MASSES) {
    renderer.setFillStyle(this.color);
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    renderer.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
  }
};

/**
 * @param {boolean} kaput
 */
RectPainter.prototype.setKaput = function(kaput) {
  this.kaput = kaput;
};

RectPainter.prototype.isKaput = function() {
  return this.kaput;
};
