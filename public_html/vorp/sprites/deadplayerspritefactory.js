/**
 * @constructor
 */
function DeadPlayerSpriteFactory(baseTemplate) {
  this.baseTemplate = baseTemplate;
}

DeadPlayerSpriteFactory.prototype.createXY = function(x, y) {
  var r = Transformer.BOX_RADIUS;
  return new DeadPlayerSprite(
      this.baseTemplate
          .makeIntangible()
          .setPainter(new DeadPlayerPainter('rgb(255, 255, 255)'))
          .setPosXY(x, y)
          .setRadXY(r, r));
};
