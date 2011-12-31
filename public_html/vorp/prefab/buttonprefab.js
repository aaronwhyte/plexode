/**
 * @constructor
 */
function ButtonPrefab(x, y, facing, onClick) {
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.onClick= onClick;
}

ButtonPrefab.prototype.createSprites = function(clock) {
  var thickness = 0.3;
  var width = 0.9;
  var a = new ButtonSprite(clock, new ButtonPainter(),
      this.x + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.x,
      this.y + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.y,
      0, 0,
      this.facing.x ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
      this.facing.y ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
      Infinity, Vorp.GENERAL_GROUP);
  a.setOnClick(this.onClick);
  return [a];
};
