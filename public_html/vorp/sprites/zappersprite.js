/**
 * @constructor
 * @extends {Sprite}
 */
function ZapperSprite(phy, painter, px, py, vx, vy, rx, ry, mass) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, mass, Vorp.ZAPPER_GROUP, Infinity);
  this.vorp = null;
}

ZapperSprite.prototype = new Sprite();
ZapperSprite.prototype.constructor = ZapperSprite;

ZapperSprite.prototype.setVorp = function(vorp) {
  this.vorp = vorp;
};

ZapperSprite.prototype.onSpriteHit = function(hitSprite, thisAcc, hitAcc, xTime, yTime, overlapping) {
  this.vorp.killPlayer();
}