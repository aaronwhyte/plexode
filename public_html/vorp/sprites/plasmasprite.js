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

PlasmaSprite.prototype.onSpriteHit = function(hitSprite) {
  this.addKaputPaintEvent();
  if (hitSprite instanceof ZombieSprite) {
    this.world.explodeZombie(hitSprite.id);
  } else if (this.world.isPlayerSpriteId(hitSprite.id)) {
    this.world.explodePlayer();
  }
  if (!(hitSprite instanceof TurretSprite)) {
    // TODO: change turret so that plasma doesn't collide on exit.
    this.world.removeSprite(this.id);
  }
  return true;
};


