/**
 * @constructor
 */
function DeadPlayerPrefab(x, y) {
  this.x = x;
  this.y = y;
}

DeadPlayerPrefab.prototype.createSprites = function(clock) {
  var r = Prefab.BOX_RADIUS;
  var a = new DeadPlayerSprite(clock, new DeadPlayerPainter('rgb(255, 255, 255)'),
      this.x, this.y, 0, 0, r, r);
  return [a];
};
