/**
 * @constructor
 * @extends {Sprite}
 */
function ExitSprite(phy, painter, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, mass, group, Infinity);
  this.vorp = null;
  this.url = null;
}

ExitSprite.prototype = new Sprite();
ExitSprite.prototype.constructor = ExitSprite;

ExitSprite.prototype.setVorp = function(vorp) {
  this.vorp = vorp;
};

ExitSprite.prototype.setUrl = function(url) {
  this.url = url;
};

ExitSprite.prototype.onSpriteHit = function(hitSprite) {
  if (hitSprite == this.vorp.getPlayerSprite()) {
    this.vorp.exitToUrl(this.url);
  }
};
