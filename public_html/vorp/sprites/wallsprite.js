/**
 * @constructor
 * @extends {Sprite}
 */
function WallSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

WallSprite.prototype = new Sprite();
WallSprite.prototype.constructor = WallSprite;
