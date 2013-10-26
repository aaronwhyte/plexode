/**
 * @constructor
 * @extends {Sprite}
 */
function PlasmaSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

PlasmaSprite.prototype = new Sprite(null);
PlasmaSprite.prototype.constructor = PlasmaSprite;

PlasmaSprite.prototype.act = function() {
};

PlasmaSprite.RADIUS = 5;

PlasmaSprite.prototype.onSpriteHit = function(hitSprite) {
  this.addKaputPaintEvent();
  if (hitSprite instanceof ZombieSprite) {
    this.world.explodeZombie(hitSprite.id);
  } else if (this.world.isPlayerSpriteId(hitSprite.id)) {
    this.world.explodePlayer();
  } else {
    var p = this.getPos(new Vec2d());
    this.world.splashPlasma(p.x, p.y);
  }
  this.world.removeSprite(this.id);
  return true;
};
