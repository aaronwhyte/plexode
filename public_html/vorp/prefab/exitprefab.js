/**
 * @constructor
 */
function ExitPrefab(x, y, url) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
  this.url = url;
}
ExitPrefab.prototype = new Prefab();
ExitPrefab.prototype.constructor = Prefab;


ExitPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var r = Prefab.WALL_RADIUS * 1.5;
  var a = new ExitSprite(
      this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#0f0"))
          .setPosXY(this.x, this.y)
          .setRadXY(r, r));
  a.setUrl(this.url);
  return [a];
};
