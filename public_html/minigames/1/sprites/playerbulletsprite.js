/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerBulletSprite(phy, game, px, py, vx, vy, lifetime) {
  this.game = game;
  var radius = 10;
  Sprite.call(this, phy,
      new RectPainter("#0f8"),
      px, py,
      vx, vy,
      radius, radius, // size
      2 * radius * radius * 4, // mass
      Game.PLAYER_FIRE_GROUP,
      Infinity);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.acceleration = new Vec2d();
  this.lifetime = lifetime;
}
PlayerBulletSprite.prototype = new Sprite();
PlayerBulletSprite.prototype.constructor = FlailSprite;

PlayerBulletSprite.prototype.onSpriteHit = function(hitSprite) {
  this.phy.removeSprite(this.phy.getSpriteId(this));
  this.painter.setKaput(true);
};


PlayerBulletSprite.prototype.act = function() {
  this.lifetime--;
  if (this.lifetime <= 0) {
    this.phy.removeSprite(this.phy.getSpriteId(this));
    this.painter.setKaput(true);
  }
};
