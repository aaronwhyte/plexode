/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerAssemblerSprite(spriteTemplate, playerSpriteFactory) {
  Sprite.call(this, spriteTemplate);
  this.playerSpriteFactory = playerSpriteFactory;
  
  /**
   * Spot where the player will be assembled
   */
  this.targetPos = this.getPos(new Vec2d());
}
PlayerAssemblerSprite.prototype = new Sprite(null);
PlayerAssemblerSprite.prototype.constructor = PlayerAssemblerSprite;

PlayerAssemblerSprite.prototype.setTargetPos = function(vec) {
  this.targetPos.set(vec);
};

PlayerAssemblerSprite.prototype.createPlayer = function() {
  var pos = this.getPos(Vec2d.alloc());
  this.painter.createSparks(pos.x, pos.y, this.targetPos.x, this.targetPos.y, this.now());
  Vec2d.free(pos);
  return this.playerSpriteFactory.createXY(this.targetPos.x, this.targetPos.y);
};