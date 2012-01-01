/**
 * @constructor
 */
function DeadPlayerPrefab(x, y) {
  this.x = x;
  this.y = y;
}

DeadPlayerPrefab.prototype.createSprites = function(gameClock, sledgeInvalidator) {
  var r = Prefab.BOX_RADIUS;
  var a = new DeadPlayerSprite(
      Prefab.createImmovableSpriteTemplate(gameClock, sledgeInvalidator)
          .setPainter(new DeadPlayerPainter('rgb(255, 255, 255)'))
          .setPosXY(this.x, this.y)
          .setRadXY(r, r)
          .setGroup(Vorp.EMPTY_GROUP));
  return [a];
};
