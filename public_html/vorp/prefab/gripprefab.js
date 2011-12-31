/**
 * @constructor
 */
function GripPrefab(x, y, facing, onChange) {
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.onChange = onChange;
}

GripPrefab.prototype.createSprites = function(clock) {
  var thickness = 0.4;
  var width = 0.5;
  var px = this.x + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.x;
  var py = this.y + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.y
  var a = new GripSprite(clock, new GripPainter(),
      px,
      py,
      this.facing.x ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
      this.facing.y ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
      Infinity, Vorp.GENERAL_GROUP);
  a.setOnChange(this.onChange);
  a.setTargetPos(new Vec2d().set(this.facing).scale(3 * Prefab.BOX_RADIUS).addXY(px, py));
  return [a];
};
