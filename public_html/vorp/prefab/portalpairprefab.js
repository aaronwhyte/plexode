/**
 * @constructor
 * @extends {Prefab}
 */
function PortalPairPrefab(x0, y0, x1, y1) {
  Prefab.call(this);
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
PortalPairPrefab.prototype = new Prefab();
PortalPairPrefab.prototype.constructor = Prefab;

PortalPairPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var r = Prefab.BOX_RADIUS * 1.1;
  var spriteTemplate = this.createMovableSpriteTemplate()
      .setMass(1.1)
      .setRadXY(r, r)
      .setGroup(Vorp.PORTAL_GROUP);
  var a = new PortalSprite(spriteTemplate
      .setPainter(new RectPainter("#0df"))
      .setPosXY(this.x0, this.y0));
  var b = new PortalSprite(spriteTemplate
      .setPainter(new RectPainter("#0df"))
      .setPosXY(this.x1, this.y1));
  a.setTargetSprite(b);
  b.setTargetSprite(a);
  return [a, b];
};
