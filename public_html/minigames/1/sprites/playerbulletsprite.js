/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerBulletSprite(phy, game, px, py, vx, vy) {
  this.game = game;
  var radius = 6;
  Sprite.call(this, phy,
      new RectPainter("#0f8"),
      px, py,
      vx, vy,
      radius, radius, // size
      radius * 4, // mass
      Game.PLAYER_FIRE_GROUP,
      Infinity);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.acceleration = new Vec2d();
}
PlayerBulletSprite.prototype = new Sprite();
PlayerBulletSprite.prototype.constructor = FlailSprite;

PlayerBulletSprite.prototype.onSpriteHit = function(hitSprite) {
  this.phy.removeSprite(this.phy.getSpriteId(this));
  this.painter.setKaput(true);
};

//
//PlayerBulletSprite.prototype.act = function() {
//};
