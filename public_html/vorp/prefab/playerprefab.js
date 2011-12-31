/**
 * @constructor
 */
function PlayerPrefab(x, y) {
  this.x = x;
  this.y = y;
}

PlayerPrefab.prototype.createSprites = function(clock) {
  var r = Prefab.BOX_RADIUS;
  var a = new PlayerSprite(clock, new PlayerPainter(), this.x, this.y, 0, 0, r, r, 1);
  return [a];
};
