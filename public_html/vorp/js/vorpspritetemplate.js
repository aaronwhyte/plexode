/**
 * Vorp-specific sprite template stuff
 * @constructor
 */
function VorpSpriteTemplate() {
  SpriteTemplate.call(this);
}
VorpSpriteTemplate.prototype = new SpriteTemplate();
VorpSpriteTemplate.prototype.constructor = VorpSpriteTemplate;

/**
 * @param {Vorp} vorp
 * @param {GameClock} gameClock
 * @param {SledgeInvalidator} sledgeInvalidator
 * @return {VorpSpriteTemplate}
 */
VorpSpriteTemplate.createBase = function(vorp, gameClock, sledgeInvalidator) {
  return new VorpSpriteTemplate()
      .setWorld(vorp)
      .setGameClock(gameClock)
      .setSledgeInvalidator(sledgeInvalidator);
};

VorpSpriteTemplate.prototype.makeIntangible = function() {
  return this.setGroup(Vorp.NO_HIT_GROUP)
      .setMass(Infinity)
      .setSledgeDuration(Infinity);
};

VorpSpriteTemplate.prototype.makeImmovable = function() {
  return this.setGroup(Vorp.WALL_GROUP)
      .setMass(Infinity)
      .setSledgeDuration(Infinity);
};

VorpSpriteTemplate.prototype.makeMovable = function() {
  return this.setGroup(Vorp.GENERAL_GROUP)
      .setSledgeDuration(1.01);
};

