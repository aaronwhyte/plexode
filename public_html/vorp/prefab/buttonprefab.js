/**
 * @constructor
 */
function ButtonPrefab(x, y, facing, onClick) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.onClick= onClick;
}
ButtonPrefab.prototype = new Prefab();
ButtonPrefab.prototype.constructor = Prefab;


ButtonPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var thickness = 0.3;
  var width = 0.9;
  var a = new ButtonSprite(
      this.createImmovableSpriteTemplate()
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
