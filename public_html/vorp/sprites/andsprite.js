/**
 * @constructor
 * @extends {Sprite}
 */
function AndSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}
AndSprite.prototype = new Sprite(null);
AndSprite.prototype.constructor = AndSprite;

AndSprite.prototype.inputIds = {
  X: 0
};

AndSprite.prototype.outputIds = {
  AND_X: 0
};

AndSprite.prototype.act = function() {
  this.outputs[this.outputIds.AND_X] = this.getInputAnd(this.inputIds.X);
};
