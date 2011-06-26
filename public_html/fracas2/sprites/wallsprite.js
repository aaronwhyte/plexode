/**
 * @constructor
 * @extends {Sprite}
 */
function WallSprite(phy, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, px, py, vx, vy, rx, ry, mass, group, Infinity);
}

WallSprite.prototype = new Sprite(null, 0, 0, 0, 0, 0, 0, 0, 0, 0);
WallSprite.prototype.constructor = WallSprite;

WallSprite.prototype.act = function() {
};

WallSprite.prototype.draw = function(renderer) {
  renderer.setFillStyle("#ddd");
  renderer.drawSprite(this);
};

WallSprite.prototype.onSpriteHit = function(hitSprite) {
};
