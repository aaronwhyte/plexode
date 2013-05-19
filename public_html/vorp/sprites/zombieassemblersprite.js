/**
 * @constructor
 * @extends {Sprite}
 */
function ZombieAssemblerSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.nextAssemblyTime = null;

  /**
   * Spot where the zombie will be assembled
   */
  this.targetPos = this.getPos(new Vec2d());

  this.pos = new Vec2d();
}
ZombieAssemblerSprite.prototype = new Sprite(null);
ZombieAssemblerSprite.prototype.constructor = ZombieAssemblerSprite;

ZombieAssemblerSprite.AVERAGE_PRODUCTION_TIME = 60 * 5;

ZombieAssemblerSprite.prototype.act = function() {
  if (!this.nextAssemblyTime) {
    this.calcNextAssemblyTime();
  }
  if (this.now() > this.nextAssemblyTime) {
    var p = this.getPos(this.pos);

    // The rayscan should be flat but as wide as the zombie, and should
    // go all the way to the top of the potential spawn volume.
    var destVec = (new Vec2d()).set(this.targetPos).subtract(p);
    var destVecLen = destVec.magnitude();
    destVec.scaleToLength(destVecLen + Transformer.BOX_RADIUS);
    destVec.add(p);

    var radiusVec = (new Vec2d()).set(this.targetPos).subtract(p)
        .rot90Right().scaleToLength(Transformer.BOX_RADIUS).abs();

    var rayScan = RayScan.alloc(
        p.x, p.y,
        destVec.x, destVec.y,
        radiusVec.x, radiusVec.y);
    var hitSpriteId = this.world.rayScan(rayScan, Vorp.GENERAL_GROUP);
    if (!hitSpriteId) {
      this.createZombie();
    }
    this.calcNextAssemblyTime();
    RayScan.free(rayScan);
  }
};

ZombieAssemblerSprite.prototype.calcNextAssemblyTime = function() {
  this.nextAssemblyTime = Math.round(this.now() +
      ZombieAssemblerSprite.AVERAGE_PRODUCTION_TIME * (0.5 + Math.random()));
};

ZombieAssemblerSprite.prototype.setTargetPos = function(vec) {
  this.targetPos.set(vec);
};

ZombieAssemblerSprite.prototype.createZombie = function() {
  var pos = this.getPos(this.pos);
  this.world.createZombieAtXY(this.targetPos.x, this.targetPos.y);
  this.painter.createSparks(pos.x, pos.y, this.targetPos.x, this.targetPos.y, this.now());
};
