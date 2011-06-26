/**
 * @constructor
 * @extends {Sprite}
 */
function BlockSprite(phy, painter, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, painter, px, py, vx, vy, rx, ry, mass, group, 1.01);
}

BlockSprite.prototype = new Sprite();
BlockSprite.prototype.constructor = BlockSprite;

BlockSprite.prototype.act = function() {
  var workVec = Vec2d.alloc();
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);
  this.accelerate(workVec);
  Vec2d.free(workVec);
};
