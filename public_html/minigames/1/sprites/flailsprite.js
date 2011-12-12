/**
 * @constructor
 * @extends {Sprite}
 */
function FlailSprite(phy, px, py) {
  var radius = 20;
  Sprite.call(this, phy,
      new RectPainter("#0fa"),
      px, py,
      0, 0, // vel
      radius, radius, // size
      radius * 4, // mass
      Game.PLAYER_GROUP,
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
  var green = Math.floor(Math.random() * 100) + 156;
  this.painter.setColor("rgb(0, " + green + ", 100)")
  this.getVel(this.workVec);
  this.workVec.scale(-Phy.FRICTION);
  this.accelerate(this.workVec);
};
