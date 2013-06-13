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

RectPainter.prototype.paint = function(vorpOut, layer) {
  if (layer == Vorp.LAYER_MASSES) {
    vorpOut.setFillStyle(this.color);
    var e = this.events.getFromHead(0);
    e.moveToTime(this.now);
    vorpOut.fillRectPosXYRadXY(e.px, e.py, e.rx, e.ry);
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
