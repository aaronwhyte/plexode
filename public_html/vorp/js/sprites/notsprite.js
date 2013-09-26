/**
 * @constructor
 * @extends {Sprite}
 */
function NotSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}
NotSprite.prototype = new Sprite(null);
NotSprite.prototype.constructor = NotSprite;

NotSprite.prototype.inputIds = {
  X: 0
};

NotSprite.prototype.outputIds = {
  NOT_X: 0
};

NotSprite.prototype.act = function() {
  this.outputs[this.outputIds.NOT_X] = !this.getInputOr(this.inputIds.X);
};
