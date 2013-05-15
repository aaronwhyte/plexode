/**
 * @constructor
 * @extends {Sprite}
 */
function PlasmaSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

PlasmaSprite.prototype = new Sprite(null);
PlasmaSprite.prototype.constructor = PlasmaSprite;

PlasmaSprite.prototype.act = function() {
};
