/**
 * @constructor
 * @extends {Prefab}
 */
function WallPrefab(x0, y0, x1, y1) {
  Prefab.call(this);
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
WallPrefab.prototype = new Prefab();
WallPrefab.prototype.constructor = Prefab;

WallPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var x0 = this.x0;
  var y0 = this.y0;
  var x1 = this.x1;
  var y1 = this.y1;
  var r = Prefab.WALL_RADIUS;
  function mid(a, b) {
    return (a + b) / 2;
  }
  function rad(a, b) {
    return Math.abs(a - b) / 2 + r;
  }
  return [new WallSprite(this.createImmovableSpriteTemplate()
      .setPainter(new RectPainter("rgb(80,48,176)"))
      .setPosXY(mid(x0, x1), mid(y0, y1))
      .setRadXY(rad(x0, x1), rad(y0, y1)))];
};
