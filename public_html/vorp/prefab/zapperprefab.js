/**
 * @constructor
 * @extends {Prefab}
 */
function ZapperPrefab(x0, y0, x1, y1, active) {
  Prefab.call(this);
  if (x0 != x1 && y0 != y1) {
    throw Error("Illegal arguments for ZapperPrefab: '" +
        [x0, y0, x1, y1].join() +
        " Either the x's or the y's have to be the same.");
  }
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.active = !!active;
}
ZapperPrefab.prototype = new Prefab();
ZapperPrefab.prototype.constructor = Prefab;

ZapperPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var x0 = this.x0;
  var y0 = this.y0;
  var x1 = this.x1;
  var y1 = this.y1;
  var r = Prefab.WALL_RADIUS;
  function mid(a, b) {
    return (a + b) / 2;
  }
  function rad(a, b) {
    return Math.abs(a - b) / 2 - 1.5 * r;
  }
  var retval;
  this.zapperPainter = new ZapperPainter(this.active);
  if (x0 == x1) {
    // vertical zapper
    retval = [
      new WallSprite(this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#88f"))
          .setPosXY(x0, y0 + 1.25 * r)
          .setRadXY(0.5 * r, 0.25 * r)),
      new WallSprite(this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#88f"))
          .setPosXY(x0, y1 - 1.25 * r)
          .setRadXY(0.5 * r, 0.25 * r))
    ];
    this.zapperSprite = new ZapperSprite(this.createImmovableSpriteTemplate()
        .setPainter(this.zapperPainter)
        .setPosXY(x0, mid(y0, y1))
        .setRadXY(0.25*r, rad(y0, y1)));
  } else {
    // horizontal zapper
    retval = [
      new WallSprite(this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#88f"))
          .setPosXY(x0 + 1.25 * r, y0)
          .setRadXY(0.25 * r, 0.5 * r)),
      new WallSprite(this.createImmovableSpriteTemplate()
          .setPainter(new RectPainter("#88f"))
          .setPosXY(x1 - 1.25 * r, y0)
          .setRadXY(0.25 * r, 0.5 * r))
    ];
    this.zapperSprite = new ZapperSprite(this.createImmovableSpriteTemplate()
        .setPainter(this.zapperPainter)
        .setPosXY(mid(x0, x1), y0)
        .setRadXY(rad(x0, x1), 0.25 * r));
  }
  if (this.active) {
    retval.push(this.zapperSprite);
  }
  return retval;
};

ZapperPrefab.prototype.setActive = function(active, vorp) {
  active = !!active;
  if (active == this.active) return; // no change
  this.active = active;
  this.zapperPainter.setActive(active);
  
  if (!vorp) return;
  if (active) {
    vorp.addSprite(this.zapperSprite);
  } else {
    vorp.removeSprite(this.zapperSprite.id);
  }
};
