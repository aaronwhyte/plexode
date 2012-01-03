/**
 * @constructor
 * @extends {Prefab}
 */
function DeadPlayerPrefab(x, y) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
}
DeadPlayerPrefab.prototype = new Prefab();
DeadPlayerPrefab.prototype.constructor = Prefab;

DeadPlayerPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var r = Prefab.BOX_RADIUS;
  var a = new DeadPlayerSprite(
      this.createImmovableSpriteTemplate()
          .setPainter(new DeadPlayerPainter('rgb(255, 255, 255)'))
          .setPosXY(this.x, this.y)
          .setRadXY(r, r)
          .setGroup(Vorp.EMPTY_GROUP));
  return [a];
};
