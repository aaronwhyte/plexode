/**
 * @constructor
 * @extends {Sprite}
 */
function DeadPlayerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

DeadPlayerSprite.prototype = new Sprite(null);
DeadPlayerSprite.prototype.constructor = DeadPlayerSprite;

DeadPlayerSprite.REASSEMBLY_TIMEOUT = 45;

DeadPlayerSprite.prototype.act = function(vorp) {
  if (!this.startTime) {
    this.startTime = this.now();
  }
  if (this.startTime + DeadPlayerSprite.REASSEMBLY_TIMEOUT < this.now()) {
    vorp.assemblePlayer();
  }
};
