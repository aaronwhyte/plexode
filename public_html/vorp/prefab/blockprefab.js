/**
 * @constructor
 */
function BlockPrefab(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size || 1;
}

BlockPrefab.prototype.createSprites = function(gameClock, sledgeInvalidator) {
  var r = Prefab.BOX_RADIUS * this.size;
  var a = new BlockSprite(
      Prefab.createMovableSpriteTemplate(gameClock, sledgeInvalidator)
        .setPainter(new RectPainter("#dd4"))
        .setPosXY(this.x, this.y)
        .setRadXY(r, r)
        .setMass(this.size * this.size));
  return [a];
};
