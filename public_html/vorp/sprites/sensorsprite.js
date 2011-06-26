/**
 * This is the sensor end of a break-beam sensor.  It doesn't really do anything interesting.
 * @constructor
 * @extends {Sprite}
 */
function SensorSprite(phy, painter, px, py, rx, ry) {
  Sprite.call(this, phy, painter, px, py, 0, 0, rx, ry, Infinity, Vorp.WALL_GROUP, Infinity);
}

SensorSprite.prototype = new Sprite();
SensorSprite.prototype.constructor = SensorSprite;
