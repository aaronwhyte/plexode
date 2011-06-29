/**
 * @constructor
 * @extends {Sprite}
 */
function DeadPlayerSprite(phy, painter, px, py, vx, vy, rx, ry) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, 0, Vorp.EMPTY_GROUP, Infinity);
//  this.pos = new Vec2d();
  this.startTime = this.now();
}

DeadPlayerSprite.prototype = new Sprite();
DeadPlayerSprite.prototype.constructor = DeadPlayerSprite;

DeadPlayerSprite.REASSEMBLY_TIMEOUT = 45;

DeadPlayerSprite.prototype.setVorp = function(vorp) {
  this.vorp = vorp;
};

DeadPlayerSprite.prototype.act = function() {
  if (this.startTime + DeadPlayerSprite.REASSEMBLY_TIMEOUT < this.now()) {
    this.vorp.assemblePlayer();
  }
};
