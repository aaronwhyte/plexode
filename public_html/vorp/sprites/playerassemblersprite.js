/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerAssemblerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  
  /**
   * Spot where the player will be assembled
   */
  this.targetPos = this.getPos(new Vec2d());
}

PlayerAssemblerSprite.prototype = new Sprite(null);
PlayerAssemblerSprite.prototype.constructor = PlayerAssemblerSprite;

PlayerAssemblerSprite.prototype.onPlayerAssembled = function() {
  this.painter.createSparks(this.px, this.py, this.targetPos.x, this.targetPos.y, this.now());
};

