/**
 * @constructor
 * @extends {Sprite}
 */
function PlayerSprite(phy, px, py, vx, vy, rx, ry, mass, group) {
  Sprite.call(this, phy, px, py, vx, vy, rx, ry, mass, group, 1.01);
  this.keysVec = new Vec2d();
  this.canFire = true;
  this.acceleration = new Vec2d();
}

PlayerSprite.prototype = new Sprite(null, 0, 0, 0, 0, 0, 0, 0, 0, 0);
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.prototype.act = function(frac) {
  // init acceleration to friction
  this.getVel(this.acceleration);
  this.acceleration.scale(-Phy.FRICTION);
  
  GU_copyCustomKeysVec(this.keysVec, VK_I, VK_L, VK_K, VK_J);
  if (GU_keys[VK_SPACE]) {
    if (this.canFire && (this.keysVec.x || this.keysVec.y)) {
      this.fire(this.keysVec.x, this.keysVec.y);
    }
  } else {
    this.acceleration.add(this.keysVec.scaleToLength(0.7));
  }
  this.addVelXY(this.acceleration.x, this.acceleration.y);
};

PlayerSprite.prototype.fire = function(x, y) {
  var now = this.now(); 
  for (var i = 0; i < 10; i++) {
    var vx = 40*x + this.vx + 20*(Math.random() - 0.5);
    var vy = 40*y + this.vy + 20*(Math.random() - 0.5);
    var lifespan = 20 + 4 * Math.random();
    var sprite = new BulletSprite(
        this.phy,
        this.px, this.py,
        vx, vy,
        3, 3,
        18,
        Fracas2.PLAYER_BULLET_GROUP,
        lifespan);
    var bulletId = this.phy.addSprite(sprite);
    this.phy.addSpriteTimeout(SpriteTimeout.alloc(
        now + lifespan, bulletId, 1));
  }
  this.canFire = false;
  this.phy.addSpriteTimeout(SpriteTimeout.alloc(now + 2, this.id, 1));
};

PlayerSprite.prototype.onTimeout = function(timeout) {
  if (timeout.actionId === 1) {
    this.canFire = true;
  }
};

PlayerSprite.prototype.draw = function(renderer) {
  renderer.setFillStyle(this.canFire ? 'yellow' : 'cyan');
  renderer.drawSprite(this);
};
