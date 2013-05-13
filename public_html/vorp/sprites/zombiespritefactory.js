/**
 * @constructor
 */
function ZombieSpriteFactory(baseTemplate) {
  this.baseTemplate = baseTemplate;
}

ZombieSpriteFactory.prototype.createXY = function(x, y) {
  var r = Transformer.BOX_RADIUS;
  return new ZombieSprite(
      this.baseTemplate
          .makeMovable()
          .setPainter(new ZombiePainter())
          .setPosXY(x, y)
          .setRadXY(r, r)
          .setMass(1));
};
