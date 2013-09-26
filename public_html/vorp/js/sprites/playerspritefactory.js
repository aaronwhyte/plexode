/**
 * @constructor
 */
function PlayerSpriteFactory(baseTemplate) {
  this.baseTemplate = baseTemplate;
}

PlayerSpriteFactory.prototype.createXY = function(x, y) {
  var r = Transformer.BOX_RADIUS;
  return new PlayerSprite(
      this.baseTemplate
          .makeMovable()
          .setPainter(new PlayerPainter())
          .setSinger(new PlayerSinger())
          .setPosXY(x, y)
          .setRadXY(r, r)
          .setMass(1)
          .setGroup(Vorp.PLAYER_GROUP));
};
