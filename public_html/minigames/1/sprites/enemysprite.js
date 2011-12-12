/**
 * @constructor
 * @extends {Sprite}
 */
function EnemySprite(phy, px, py) {
  var radius = 20;
  function r(n) {
    return Math.floor(Math.random() * n);
  }
  var rad = 15 + r(10);
  Sprite.call(this, phy,
      new RectPainter(
          "rgb(" + [200 + r(56), 200 + r(56), 200 + r(56)].join(",") + ")"),
      px, py,
      0, 0, // vel
      rad, rad, // size
      rad * 4, // mass
      Game.ENEMY_GROUP,
      1.01);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.facing = Math.random() * 2 * Math.PI;
  this.turning = 0;

  this.acceleration = new Vec2d();
}
EnemySprite.prototype = new Sprite();
EnemySprite.prototype.constructor = EnemySprite;

EnemySprite.ACCEL = 3;

EnemySprite.prototype.act = function() {
  // move
  var workVec = Vec2d.alloc(0, 0);

  // friction
  this.getVel(workVec);
  workVec.scale(-Phy.FRICTION);

  // thrust in facing direction
  this.turning += (Math.random() - 0.5) * 0.5;
  this.facing += this.turning;
  this.turning *= 0.9;
  workVec.addXY(
      EnemySprite.ACCEL * Math.sin(this.facing),
      EnemySprite.ACCEL * -Math.cos(this.facing));

  this.accelerateXY(workVec.x, workVec.y);
  Vec2d.free(workVec);
};
