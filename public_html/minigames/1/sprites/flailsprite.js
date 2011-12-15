/**
 * @constructor
 * @extends {Sprite}
 */
function FlailSprite(phy, px, py) {
  var radius = 25;
  Sprite.call(this, phy,
      new RectPainter("#0fa"),
      px, py,
      0, 0, // vel
      radius, radius, // size
      0.3 * radius * radius * 4, // mass
      Game.PLAYER_FIRE_GROUP,
      1.01);
  
  this.pos = new Vec2d();
  this.vel = new Vec2d();
  this.acceleration = new Vec2d();
  this.workVec = new Vec2d();
}
FlailSprite.prototype = new Sprite();
FlailSprite.prototype.constructor = FlailSprite;

FlailSprite.prototype.act = function() {
  // friction
  var r = Math.floor(Math.random() * 100) + 156;
  this.painter.setColor("rgb(0, " + r + ", 100)");
  this.getVel(this.workVec);
  this.workVec.scale(-Phy.FRICTION * 0.75);
  this.accelerate(this.workVec);
};
