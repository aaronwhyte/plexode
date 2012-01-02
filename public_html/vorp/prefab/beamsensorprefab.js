/**
 * @constructor
 */
function BeamSensorPrefab(x0, y0, x1, y1, onChange) {
  Prefab.call(this);
  if (x0 != x1 && y0 != y1) {
    throw Error("Illegal arguments for BeamSensorPrefab: '" +
        [x0, y0, x1, y1].join() +
        " Either the x's or the y's have to be the same.");
  }
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.onChange = onChange;
}
BeamSensorPrefab.prototype = new Prefab();
BeamSensorPrefab.prototype.constructor = Prefab;

BeamSensorPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var x0 = this.x0;
  var y0 = this.y0;
  var x1 = this.x1;
  var y1 = this.y1;
  var r = Prefab.WALL_RADIUS;
  var sgn;
  var beamerTemplate =
      this.createImmovableSpriteTemplate()
          .setPainter(new BeamerPainter());
  var sensorTemplate =
      this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#888"));
  if (x0 == x1) {
    // vertical    
    sgn = Math.sgn(y1 - y0);
    beamerTemplate.setPosXY(x0, y0 + r * 1.3 * sgn).setRadXY(0.25 * r, 0.3 * r);
    sensorTemplate.setPosXY(x1, y1 - r * 1.1 * sgn).setRadXY(0.3 * r, 0.1 * r);
  } else {
    // horizontal
    sgn = Math.sgn(x1 - x0);
    beamerTemplate.setPosXY(x0 + r * 1.3 * sgn, y0).setRadXY(0.3 * r, 0.25 * r);
    sensorTemplate.setPosXY(x1 - r * 1.1 * sgn, y1).setRadXY(0.1 * r, 0.3 * r);
  }
  var beamer = new BeamerSprite(beamerTemplate);
  var sensor = new SensorSprite(sensorTemplate);
  beamer.setTargetSprite(sensor);
  beamer.setOnChange(this.onChange);
  return [beamer, sensor];
};
