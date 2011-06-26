/**
 * @constructor
 */
function PlayerPrefab(x, y) {
  this.x = x;
  this.y = y;
}

PlayerPrefab.prototype.createSprites = function(vorp) {
  var r = Prefab.BOX_RADIUS;
  var a = new PlayerSprite(vorp.phy, new PlayerPainter(), this.x, this.y, 0, 0, r, r, 1);
  vorp.setPlayerSprite(a);
  return [a];
};
