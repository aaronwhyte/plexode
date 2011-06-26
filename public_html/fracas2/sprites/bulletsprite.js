/**
 * @constructor
 * @extends {Sprite}
 */
function BulletSprite(phy, px, py, vx, vy, rx, ry, mass, group, lifespan) {
  Sprite.call(this, phy, px, py, vx, vy, rx, ry, mass, group, lifespan);
}

BulletSprite.prototype = new Sprite(null, 0, 0, 0, 0, 0, 0, 0, 0, 0);
BulletSprite.prototype.constructor = BulletSprite;

BulletSprite.prototype.onTimeout = function(timeout) {
  this.phy.removeSprite(this.id);
};

BulletSprite.prototype.draw = function(renderer) {
  renderer.setFillStyle('white');
  renderer.drawSprite(this);
};

BulletSprite.prototype.onSpriteHit = function(hitSprite) {
  this.phy.removeSprite(this.id);
};
