/**
 * @constructor
 * @extends {Prefab}
 */
function BlockPrefab(x, y, size) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
  this.size = size || 1;
}
BlockPrefab.prototype = new Prefab();
BlockPrefab.prototype.constructor = Prefab;

BlockPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var r = Prefab.BOX_RADIUS * this.size;
  var a = new BlockSprite(
      this.createMovableSpriteTemplate()
        .setPainter(new RectPainter("#dd4"))
        .setPosXY(this.x, this.y)
        .setRadXY(r, r)
        .setMass(this.size * this.size));
  return [a];
};
