/**
 * @constructor
 * @extends {Sprite}
 */
function WallSprite(clock, painter, px, py, rx, ry) {
  Sprite.call(this, clock, painter, px, py, 0, 0, rx, ry, Infinity, Vorp.WALL_GROUP, Infinity);
}

WallSprite.prototype = new Sprite();
WallSprite.prototype.constructor = WallSprite;
