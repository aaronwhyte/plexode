/**
 * @constructor
 * @extends {Sprite}
 */
function BoulderSprite(phy, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, px, py, vx, vy, rx, ry, mass, group, 1.01);
  this.workVec = new Vec2d();
  this.color = '#' + 
    (6 + Math.floor(Math.random() * 10)).toString(16) +
    (6 + Math.floor(Math.random() * 10)).toString(16) +
    (6 + Math.floor(Math.random() * 10)).toString(16);
}

BoulderSprite.prototype = new Sprite(null, 0, 0, 0, 0, 0, 0, 0, 0, 0);
BoulderSprite.prototype.constructor = BoulderSprite;

BoulderSprite.prototype.act = function(frac) {
  this.getVel(this.workVec);
  this.workVec.scale(1 - Phy.FRICTION);
  this.setVelXY(this.workVec.x, this.workVec.y);
};

BoulderSprite.prototype.draw = function(renderer, now) {
  renderer.setFillStyle(this.color);
  renderer.drawSprite(this);
};