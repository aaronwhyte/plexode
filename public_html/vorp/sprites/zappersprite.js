/**
 * @constructor
 * @extends {Sprite}
 */
function ZapperSprite(clock, painter, px, py, vx, vy, rx, ry, mass) {
  Sprite.call(this, clock, painter, px, py, vx, vy, rx, ry, mass, Vorp.ZAPPER_GROUP, Infinity);
  this.vorp = null;
}

ZapperSprite.prototype = new Sprite();
ZapperSprite.prototype.constructor = ZapperSprite;

ZapperSprite.prototype.onSpriteHit = function(hitSprite, vorp) {
  vorp.killPlayer();
}