/**
 * @constructor
 */
function ButtonPrefab(x, y, facing, onClick) {
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.onClick= onClick;
}

ButtonPrefab.prototype.createSprites = function(gameClock, sledgeInvalidator) {
  var thickness = 0.3;
  var width = 0.9;
  var a = new ButtonSprite(
      Prefab.createImmovableSpriteTemplate(gameClock, sledgeInvalidator)
        .setPainter(new ButtonPainter())
        .setPosXY(
            this.x + (Prefab.WALL_RADIUS * (thickness + 1) * this.facing.x),
            this.y + (Prefab.WALL_RADIUS * (thickness + 1) * this.facing.y))
        .setRadXY(
            Prefab.WALL_RADIUS * (this.facing.x ? thickness : width),
            Prefab.WALL_RADIUS * (this.facing.y ? thickness : width)));
  a.setOnClick(this.onClick);
  return [a];
};
