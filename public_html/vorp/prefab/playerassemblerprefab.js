/**
 * @param {boolean} isEntrance  Whether this is the initial entrance to the level.
 * @constructor
 */
function PlayerAssemblerPrefab(x, y, facing, isEntrance) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.isEntrance = isEntrance;
}
PlayerAssemblerPrefab.prototype = new Prefab();
PlayerAssemblerPrefab.prototype.constructor = Prefab;


PlayerAssemblerPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var thickness = 0.5;
  var width = 2;
  var a = new PlayerAssemblerSprite(this.createImmovableSpriteTemplate()
      .setPainter(new PlayerAssemblerPainter())
      .setPosXY(
          this.x + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.x,
          this.y + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.y)
      .setRadXY(
          this.facing.x ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
          this.facing.y ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width));
  var targetDist = Prefab.WALL_RADIUS + 2.01 * Prefab.WALL_RADIUS * thickness + Prefab.BOX_RADIUS;
  a.targetPos.setXY(
      this.x + targetDist * this.facing.x,
      this.y + targetDist * this.facing.y);
  return [a];
};
