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
  if (hitSprite instanceof PlayerSprite) {
    this.world.explodePlayer();
  } else if (hitSprite instanceof ZombieSprite) {
    this.world.explodeZombie(hitSprite.id);
  }
};
