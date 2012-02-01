/**
 * @constructor
 * @extends {Sprite}
 */
function ButtonSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.lastClickTime = -Infinity;
}
ButtonSprite.prototype = new Sprite(null);
ButtonSprite.prototype.constructor = ButtonSprite;

ButtonSprite.prototype.outputIds = {
  CLICKED: 0
};

ButtonSprite.DEBOUNCE = 15;

ButtonSprite.prototype.isDebouncing = function() {
  return this.lastClickTime + ButtonSprite.DEBOUNCE - this.now() > 0;
};

ButtonSprite.prototype.onSpriteHit = function(hitSprite) {
  var clicked = 0;
  if (!this.isDebouncing()) {
    clicked = 1;
    this.lastClickTime = this.now();
    this.painter.setLastClickTime(this.lastClickTime);
  }
  this.outputs[this.outputIds.CLICKED] = clicked;
};
