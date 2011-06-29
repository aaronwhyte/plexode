/**
 * @param {boolean} isEntrance  Whether this is the initial entrance to the level.
 * @constructor
 */
function PlayerAssemblerPrefab(x, y, facing, isEntrance) {
  this.x = x;
  this.y = y;
  this.facing = facing;
  this.isEntrance = isEntrance;
}

PlayerAssemblerPrefab.prototype.createSprites = function(vorp) {
  var thickness = 0.5;
  var width = 2;
  var a = new PlayerAssemblerSprite(vorp.phy, new PlayerAssemblerPainter(),
      this.x + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.x,
      this.y + (Prefab.WALL_RADIUS * thickness + Prefab.WALL_RADIUS) * this.facing.y,
      0, 0,
      this.facing.x ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
      this.facing.y ? Prefab.WALL_RADIUS * thickness : Prefab.WALL_RADIUS * width,
      Infinity, Vorp.GENERAL_GROUP);
  
  var targetDist = Prefab.WALL_RADIUS + 2.01 * Prefab.WALL_RADIUS * thickness + Prefab.BOX_RADIUS;
  a.targetPos.setXY(
      this.x + targetDist * this.facing.x,
      this.y + targetDist * this.facing.y);
  return [a];
};
