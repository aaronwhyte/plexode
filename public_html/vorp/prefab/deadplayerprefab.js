/**
 * @constructor
 */
function DeadPlayerPrefab(x, y) {
  this.x = x;
  this.y = y;
}

DeadPlayerPrefab.prototype.createSprites = function(vorp) {
  var r = Prefab.BOX_RADIUS;
  var a = new DeadPlayerSprite(vorp.phy, new DeadPlayerPainter('rgb(255, 255, 255)'),
      this.x, this.y, 0, 0, r, r);
  a.setVorp(vorp);
  return [a];
};
