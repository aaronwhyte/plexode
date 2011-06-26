/**
 * The params for a door are unlike most other sprites, so heads up.
 * @param x0 {number} where the door is attached to the wall
 * @param y0 {number} where the door is attached to the wall
 * @param x1 {number} the point the door extends to when closed
 * @param y1 {number} the point the door extends to when closed
 * @param thickness {number} the door's thickness
 * @param closedness {number} A number between 0 (open) and 1 (closed)
 * @param topSpeed {number} A number between 0 and 1 indicating the max change in "closedness" changes per tick.
 * @param accel {number} How much the door speed can change per tick.  
 * @constructor
 * @extends {Sprite}
 */
function DoorSprite(phy, painter, x0, y0, x1, y1, thickness, closedness, topSpeed, accel) {
  Sprite.call(this, phy, painter, x0, y0, 0, 0, 100, 100, Infinity, Vorp.WALL_GROUP, Infinity);
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.thickness = thickness;
  this.destClosedness = this.closedness = closedness;
  this.topSpeed = topSpeed;
  this.accel = accel;

  this.speed = 0;
  this.setDimensions();
}

DoorSprite.prototype = new Sprite();
DoorSprite.prototype.constructor = DoorSprite;

DoorSprite.prototype.setDimensions = function() {
  if (this.x0 == this.x1) {
    // vertical
    var offY = this.closedness * (this.y1 - this.y0) * 0.5;
    this.setPosXY(this.x0, this.y0 + offY);
    this.setRadXY(this.thickness, Math.abs(offY));
  } else if (this.y0 == this.y1) {
    // horizontal
    var offX = this.closedness * (this.x1 - this.x0) * 0.5;
    this.setPosXY(this.x0 + offX, this.y0);
    this.setRadXY(Math.abs(offX), this.thickness);
  } else {
    throw Error("Door is neither horizontal nor vertical. x0, y0, x1, y1: " + 
        [this.x0, this.y0, this.x1, this.y1]);
  }
};

DoorSprite.prototype.act = function() {
  if (this.closedness != this.destClosedness) {
    this.speed = Math.min(this.speed + this.accel, this.topSpeed);
    if (this.closedness < this.destClosedness) {
      this.closedness = Math.min(this.closedness + this.speed, this.destClosedness);
    } else {
      this.closedness = Math.max(this.closedness - this.speed, this.destClosedness);
    }
    this.setDimensions();
  }
  if (this.closedness == this.destClosedness) {
    this.speed = 0;
  }
};
