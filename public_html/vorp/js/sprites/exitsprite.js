/**
 * @constructor
 * @extends {Sprite}
 */
function ExitSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.url = null;
}

ExitSprite.prototype = new Sprite(null);
ExitSprite.prototype.constructor = ExitSprite;

ExitSprite.prototype.setUrl = function(url) {
  this.url = url;
};

ExitSprite.prototype.onSpriteHit = function(hitSprite) {
  if (hitSprite == this.world.getPlayerSprite()) {
    this.world.exitToUrl(this.url);
  }
};
