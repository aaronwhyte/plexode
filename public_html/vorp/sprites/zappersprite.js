/**
 * @constructor
 * @extends {Sprite}
 */
function ZapperSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

ZapperSprite.prototype = new Sprite();
ZapperSprite.prototype.constructor = ZapperSprite;

ZapperSprite.prototype.onSpriteHit = function(hitSprite, vorp) {
  vorp.killPlayer();
}