/**
 * @constructor
 * @extends {Sprite}
 */
function WallSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

WallSprite.prototype = new Sprite(null);
WallSprite.prototype.constructor = WallSprite;
