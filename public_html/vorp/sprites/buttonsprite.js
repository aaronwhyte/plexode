/**
 * @constructor
 * @extends {Sprite}
 */
function ButtonSprite(phy, painter, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, mass, group, Infinity);
  this.onClick = null;
  this.lastClickTime = -Infinity;
}
ButtonSprite.prototype = new Sprite();
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
