/**
 * @constructor
 */
function BlockPrefab(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size || 1;
}

BlockPrefab.prototype.createSprites = function(clock) {
  var r = Prefab.BOX_RADIUS * this.size;
  var a = new BlockSprite(clock, new RectPainter("#dd4"),
      this.x, this.y, 0, 0, r, r, this.size * this.size, Vorp.GENERAL_GROUP);
  return [a];
};
