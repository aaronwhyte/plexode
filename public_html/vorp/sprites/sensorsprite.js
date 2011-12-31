/**
 * This is the sensor end of a break-beam sensor.
 * @constructor
 * @extends {Sprite}
 */
function SensorSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
}

SensorSprite.prototype = new Sprite();
SensorSprite.prototype.constructor = SensorSprite;
