/**
 * The params for a door are unlike most other sprites, so heads up.
 * @constructor
 * @extends {Sprite}
 */
function ZapperControlSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.zapperSprite = null;
  this.oldOpen = 0;
}

ZapperControlSprite.prototype = new Sprite(null);
ZapperControlSprite.prototype.constructor = ZapperControlSprite;

ZapperControlSprite.prototype.inputIds = {
  OPEN: 0
};

ZapperControlSprite.prototype.setZapperSprite = function(s) {
  this.zapperSprite = s;
};

ZapperControlSprite.prototype.act = function() {
  var newOpen = this.getInputOr(this.inputIds.OPEN);
  if (!this.oldOpen && newOpen) {
    this.world.removeSprite(this.zapperSprite.id);
  } else if (this.oldOpen && !newOpen) {
    this.world.addSprite(this.zapperSprite);
  }
  this.zapperSprite.getPainter().setActive(!newOpen);
  this.oldOpen = newOpen;
};
