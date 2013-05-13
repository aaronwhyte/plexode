/**
 * @constructor
 * @extends {Sprite}
 */
function DeadPlayerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

DeadPlayerSprite.prototype = new Sprite(null);
DeadPlayerSprite.prototype.constructor = DeadPlayerSprite;

DeadPlayerSprite.REASSEMBLY_TIMEOUT = 30;

DeadPlayerSprite.prototype.act = function() {
  if (!this.startTime) {
    this.startTime = this.now();
  }
  if (this.startTime + DeadPlayerSprite.REASSEMBLY_TIMEOUT < this.now()) {
    this.world.removeSprite(this.id);
    this.world.assemblePlayer();
  }
};
