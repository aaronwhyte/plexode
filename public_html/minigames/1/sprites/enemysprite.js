/**
 * @constructor
 * @extends {Sprite}
 */
function EnemySprite(phy, px, py) {
  function r(n) {
    return Math.floor(Math.random() * n);
  }
  var radius = 20 + r(20);
  Sprite.call(this, phy,
      new RectPainter(
          "rgb(" + [100 + r(156), 100 + r(156), 100 + r(156)].join(",") + ")"),
      px, py,
      0, 0, // vel
      radius, radius, // size
      radius * radius * 4, // mass
      Game.ENEMY_GROUP,
      1.01);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.facing = Math.random() * 2 * Math.PI;
  this.turning = 0;
  this.health = 1;

  this.acceleration = new Vec2d();
}
EnemySprite.prototype = new Sprite();
EnemySprite.prototype.constructor = EnemySprite;

EnemySprite.FORCE = 4000;

EnemySprite.prototype.act = function() {
  // move
  var workVec = Vec2d.alloc(0, 0);

  // friction
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);

  if (this.health > 0) {
    // thrust in facing direction
    this.turning += (Math.random() - 0.5) * 0.2;
    this.facing += this.turning;
    this.turning *= 0.9;
    workVec.addXY(
        EnemySprite.FORCE / this.mass * Math.sin(this.facing),
        EnemySprite.FORCE / this.mass * -Math.cos(this.facing));
  }
  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);
};


EnemySprite.prototype.onSpriteHit = function(hitSprite) {
  if (this.health <= 0) {
    return;
  }
  if (hitSprite instanceof PlayerBulletSprite || hitSprite instanceof FlailSprite) {
    this.health--;
    if (this.health <= 0) {
      this.painter.setColor("#444");
      this.mass /= 3;
    }
  }
//  if (this.health <= 0) {
//    this.phy.removeSprite(this.phy.getSpriteId(this));
//    this.painter.setKaput(true);
//  }
};
