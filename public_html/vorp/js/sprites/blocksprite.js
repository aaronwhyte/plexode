/**
 * @constructor
 * @extends {Sprite}
 */
function BlockSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

BlockSprite.prototype = new Sprite(null);
BlockSprite.prototype.constructor = BlockSprite;

BlockSprite.prototype.act = function() {
  this.addFriction(Vorp.FRICTION);
};
