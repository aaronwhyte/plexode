/**
 * @constructor
 * @extends {Sprite}
 */
function ToggleSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.state = false;
}
ToggleSprite.prototype = new Sprite(null);
ToggleSprite.prototype.constructor = ToggleSprite;

ToggleSprite.prototype.inputIds = {
  TOGGLE: 0
};

ToggleSprite.prototype.outputIds = {
  STATE: 0
};

ToggleSprite.prototype.act = function() {
  if (this.getInputOr(this.inputIds.TOGGLE)) {
    this.state = !this.state;
  }
  this.outputs[this.outputIds.STATE] = this.state;
};
