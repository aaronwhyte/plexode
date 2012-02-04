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
  var newOpen = this.inputs[this.inputIds.OPEN];
  if (!this.oldOpen && newOpen) {
    // newly opened. Remove zapperSprite from world.
    this.world.removeSprite(this.zapperSprite.id);
  } else if (this.oldOpen && !newOpen) {
    // newly closed. Add zapperSprite back to world.
    this.world.addSprite(this.zapperSprite);
  }
  this.oldOpen = newOpen;
};
