/**
 * @constructor
 */
function GripPrefab(x, y, facing, onChange) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.onChange = onChange;
}
GripPrefab.prototype = new Prefab();
GripPrefab.prototype.constructor = Prefab;

GripPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var thickness = 0.4;
  var width = 0.5;
  var px = this.x + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.x;
  var py = this.y + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.y;
  var a = new GripSprite(this.createImmovableSpriteTemplate()
      .setPainter(new GripPainter())
      .setPosXY(px, py)
      .setRadXY(
          this.facing.x ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
          this.facing.y ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width));
  a.setOnChange(this.onChange);
  a.setTargetPos(new Vec2d().set(this.facing).scale(3 * Prefab.BOX_RADIUS).addXY(px, py));
  return [a];
};
