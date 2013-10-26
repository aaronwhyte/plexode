/**
 * An invisible logic sprite that can open and close a pair of door sprites.
 * @constructor
 * @extends {Sprite}
 */
function DoorControlSprite(spriteTemplate) {
  Sprite.call(this, spriteTemplate);
  this.speed = 0;
  this.closedness = 1;
  this.doorSprites = [];
}

DoorControlSprite.prototype = new Sprite(null);
DoorControlSprite.prototype.constructor = DoorControlSprite;

DoorControlSprite.prototype.inputIds = {
  OPEN: 0
};

DoorControlSprite.TOP_SPEED = 0.3;
DoorControlSprite.ACCEL = 0.02;
DoorControlSprite.MIN_CLOSEDNESS = 0.03;

DoorControlSprite.prototype.addDoorSprite = function(s) {
  this.doorSprites.push(s);
};

DoorControlSprite.prototype.act = function() {
  var destClosedness = this.getInputOr(this.inputIds.OPEN) ? DoorControlSprite.MIN_CLOSEDNESS : 1;
  if (this.closedness != destClosedness) {
    this.speed = Math.min(this.speed + DoorControlSprite.ACCEL, DoorControlSprite.TOP_SPEED);
    if (this.closedness < destClosedness) {
      this.closedness = Math.min(this.closedness + this.speed, destClosedness);
    } else {
      this.closedness = Math.max(this.closedness - this.speed, destClosedness);
    }
    for (var i = 0; i < this.doorSprites.length; i++) {
      this.doorSprites[i].setClosedness(this.closedness);
    }
  }
  if (this.closedness == destClosedness) {
    this.speed = 0;
  }
};
