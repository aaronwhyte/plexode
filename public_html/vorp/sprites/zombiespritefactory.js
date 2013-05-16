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
          .setGroup(Vorp.MONSTER_GROUP)
          .setPainter(new ZombiePainter())
          .setPosXY(x, y)
          .setVelXY(0, 0)
          .setRadXY(r, r)
          .setMass(1));
};
