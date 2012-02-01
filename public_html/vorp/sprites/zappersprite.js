/**
 * @constructor
 * @extends {Sprite}
 */
function ZapperSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

ZapperSprite.prototype = new Sprite(null);
ZapperSprite.prototype.constructor = ZapperSprite;

ZapperSprite.prototype.onSpriteHit = function(hitSprite) {
  this.world.killPlayer();
};
