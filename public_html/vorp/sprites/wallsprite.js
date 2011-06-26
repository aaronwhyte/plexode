/**
 * @constructor
 * @extends {Sprite}
 */
function WallSprite(phy, painter, px, py, rx, ry) {
  Sprite.call(this, phy, painter, px, py, 0, 0, rx, ry, Infinity, Vorp.WALL_GROUP, Infinity);
}

WallSprite.prototype = new Sprite();
WallSprite.prototype.constructor = WallSprite;
