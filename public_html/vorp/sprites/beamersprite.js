/**
 * This is the beam-shooting end of a break-beam sensor.
 * @constructor
 * @extends {Sprite}
 */
function BeamerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.targetSprite = null;
  this.beamBroken = false;
}

BeamerSprite.prototype = new Sprite(null);
BeamerSprite.prototype.constructor = BeamerSprite;

BeamerSprite.prototype.setTargetSprite = function(t) {
  this.targetSprite = t;
};

BeamerSprite.prototype.setOnChange = function(f) {
  this.onChange = f;
};

BeamerSprite.prototype.act = function(vorp) {
  if (this.targetSprite == null) return;
  var pos = this.getPos(Vec2d.alloc());
  var targetPos = this.targetSprite.getPos(Vec2d.alloc());
  var rayScan = RayScan.alloc(
      pos.x, pos.y,
      targetPos.x, targetPos.y,
      1, 1);
  var hitSpriteId = vorp.rayScan(rayScan, Vorp.GENERAL_GROUP);
  if (hitSpriteId) {
    this.painter.setBeamEndXY(
        pos.x + rayScan.time * (targetPos.x - pos.x),
        pos.y + rayScan.time * (targetPos.y - pos.y));
  }
  RayScan.free(rayScan);
  var beamBroken = hitSpriteId != this.targetSprite.id;
  if (this.beamBroken != beamBroken) {
    this.beamBroken = beamBroken;
    if (this.onChange) {
      this.onChange(beamBroken);
    }
  }
  Vec2d.free(pos);
  Vec2d.free(targetPos);
};
