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

WallPrefab.createChain = function(coords) {
  var a = [];
  var ox = null, oy = null;
  for (var i = 0; i < coords.length; i += 2) {
    var x = coords[i];
    var y = coords[i + 1];
    if (ox != null && oy != null) {
      a.push(new WallPrefab(ox, oy, x, y));
    }
    ox = x;
    oy = y;
  }
  return a;
};

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
