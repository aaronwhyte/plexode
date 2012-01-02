/**
 * @constructor
 */
function PlayerPrefab(x, y) {
  Prefab.call(this);
  this.x = x;
  this.y = y;
}
PlayerPrefab.prototype = new Prefab();
PlayerPrefab.prototype.constructor = Prefab;


PlayerPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var r = Prefab.BOX_RADIUS;
  var a = new PlayerSprite(this.createMovableSpriteTemplate()
      .setPainter(new PlayerPainter())
      .setPosXY(this.x, this.y)
      .setRadXY(r, r)
      .setMass(1)
      .setGroup(Vorp.PLAYER_GROUP));
  return [a];
};
