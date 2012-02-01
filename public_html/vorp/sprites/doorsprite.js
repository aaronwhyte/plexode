/**
 * The params for a door are unlike most other sprites, so heads up.
 * @param x0 {number} where the door is attached to the wall
 * @param y0 {number} where the door is attached to the wall
 * @param x1 {number} the point the door extends to when closed
 * @param y1 {number} the point the door extends to when closed
 * @constructor
 * @extends {Sprite}
 */
function DoorSprite(spriteTemplate, x0, y0, x1, y1) {
  Sprite.call(this, spriteTemplate);
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.prevClosedness = this.closedness = 1;
  this.setDimensions();
}
DoorSprite.prototype = new Sprite(null);
DoorSprite.prototype.constructor = DoorSprite;

DoorSprite.THICKNESS = 10;

DoorSprite.prototype.act = function() {
  if (this.closedness != this.prevClosedness) {
    this.setDimensions();
  }
};

DoorSprite.prototype.setClosedness = function(closedness) {
  this.closedness = closedness;
};

DoorSprite.prototype.setDimensions = function() {
  if (this.x0 == this.x1) {
    // vertical
    var offY = this.closedness * (this.y1 - this.y0) * 0.5;
    this.setPosXY(this.x0, this.y0 + offY);
    this.setRadXY(DoorSprite.THICKNESS, Math.abs(offY));
  } else if (this.y0 == this.y1) {
    // horizontal
    var offX = this.closedness * (this.x1 - this.x0) * 0.5;
    this.setPosXY(this.x0 + offX, this.y0);
    this.setRadXY(Math.abs(offX), DoorSprite.THICKNESS);
  } else {
    throw Error("Door is neither horizontal nor vertical. x0, y0, x1, y1: " +
        [this.x0, this.y0, this.x1, this.y1]);
  }
  this.prevClosedness = this.closedness;
};
