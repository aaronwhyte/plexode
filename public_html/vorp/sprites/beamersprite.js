/**
 * This is the sensor end of a break-beam sensor.  It doesn't really do anything interesting,
 * but if we need to 
 * @constructor
 * @extends {Sprite}
 */
function BeamerSprite(phy, painter, px, py, rx, ry) {
  Sprite.call(this, phy, painter, px, py, 0, 0, rx, ry, Infinity, Vorp.WALL_GROUP, Infinity);
  this.targetSprite = null;
  this.beamBroken = false;
}

BeamerSprite.prototype = new Sprite();
BeamerSprite.prototype.constructor = BeamerSprite;

BeamerSprite.prototype.setTargetSprite = function(t) {
  this.targetSprite = t;
};

BeamerSprite.prototype.setOnChange = function(f) {
  this.onChange = f;
}

BeamerSprite.prototype.act = function() {
  if (this.targetSprite == null) return;
  var rayScan = RayScan.alloc(
      this.px, this.py,
      this.targetSprite.px, this.targetSprite.py,
      1, 1);
  this.phy.rayScan(rayScan, Vorp.GENERAL_GROUP);
  var hitSledgeId = rayScan.hitSledgeId;
  if (rayScan.time) {
    this.painter.setBeamEndXY(
        this.px + rayScan.time * (this.targetSprite.px - this.px),
        this.py + rayScan.time * (this.targetSprite.py - this.py));
  }
  RayScan.free(rayScan);
  var sprite = this.phy.getSpriteBySledgeId(hitSledgeId);
  var spriteId = sprite ? sprite.id : null;
  var beamBroken = spriteId != this.targetSprite.id;
  if (this.beamBroken != beamBroken) {
    this.beamBroken = beamBroken;
    if (this.onChange) {
      this.onChange(beamBroken);
    }
  }
};
