/**
 * @constructor
 * @extends {Sprite}
 */
function ButtonSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.onClick = null;
  this.lastClickTime = -Infinity;
}
ButtonSprite.prototype = new Sprite(null);
ButtonSprite.prototype.constructor = ButtonSprite;

ButtonSprite.DEBOUNCE = 15;

ButtonSprite.prototype.setOnClick = function(f) {
  this.onClick = f;
};

ButtonSprite.prototype.isDebouncing = function() {
  return this.lastClickTime + ButtonSprite.DEBOUNCE - this.now() > 0;
};

ButtonSprite.prototype.onSpriteHit = function(hitSprite) {
  if (!this.isDebouncing()) {
    this.onClick && this.onClick.call();
    this.lastClickTime = this.now();
    this.painter.setLastClickTime(this.lastClickTime);
  }
};
