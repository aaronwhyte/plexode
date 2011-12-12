/**
 * @constructor
 * @extends {Sprite}
 */
function WallSprite(phy, px, py, rx, ry) {
  Sprite.call(this, phy, new RectPainter("#888"), px, py, 0, 0, rx, ry, Infinity, Game.WALL_GROUP, Infinity);
}
WallSprite.prototype = new Sprite();
WallSprite.prototype.constructor = WallSprite;
