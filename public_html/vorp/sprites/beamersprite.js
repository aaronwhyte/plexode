/**
 * This is the beam-shooting end of a break-beam sensor.
 * @constructor
 * @extends {Sprite}
 */
function BeamerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.targetSprite = null;
}

BeamerSprite.prototype = new Sprite(null);
BeamerSprite.prototype.constructor = BeamerSprite;

BeamerSprite.prototype.setTargetSprite = function(t) {
  this.targetSprite = t;
};

BeamerSprite.prototype.outputIds = {
  BEAM_BROKEN: 0
};

BeamerSprite.prototype.act = function() {
  if (this.targetSprite == null) return;
  var pos = this.getPos(Vec2d.alloc());
  var targetPos = this.targetSprite.getPos(Vec2d.alloc());
  var rayScan = RayScan.alloc(
      pos.x, pos.y,
      targetPos.x, targetPos.y,
      1, 1);
  var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
  if (hitSpriteId) {
    this.painter.setBeamEndXY(
        pos.x + rayScan.time * (targetPos.x - pos.x),
        pos.y + rayScan.time * (targetPos.y - pos.y));
  }
  RayScan.free(rayScan);
  this.outputs[this.outputIds.BEAM_BROKEN] =
      hitSpriteId == this.targetSprite.id ? 0 : 1;
  Vec2d.free(pos);
  Vec2d.free(targetPos);
};
