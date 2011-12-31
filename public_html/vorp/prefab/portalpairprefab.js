/**
 * @constructor
 */
function PortalPairPrefab(x0, y0, x1, y1) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

PortalPairPrefab.prototype.createSprites = function(clock) {
  var r = Prefab.BOX_RADIUS * 1.1;
  var mass = 1.1;
  var a = new PortalSprite(clock, new RectPainter("#0df"), this.x0, this.y0, 0, 0, r, r, mass);
  var b = new PortalSprite(clock, new RectPainter("#0df"), this.x1, this.y1, 0, 0, r, r, mass);
  a.setTargetSprite(b);
  b.setTargetSprite(a);
  return [a, b];
};
