/**
 * @constructor
 * @extends {Sprite}
 */
function ButtonSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.lastClickTime = -Infinity;
  this.clicked = false;
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

ButtonSprite.prototype.act = function() {
  this.outputs[this.outputIds.CLICKED] = this.clicked ? 1 : 0;
  this.clicked = false;
};

ButtonSprite.prototype.onSpriteHit = function(hitSprite) {
  if (!this.isDebouncing()) {
    this.lastClickTime = this.now();
    this.painter.setLastClickTime(this.lastClickTime);
    this.clicked = true;
  }
};
