/**
 * @constructor
 */
function DoorPrefab(x0, y0, x1, y1, closed) {
  if (x0 != x1 && y0 != y1) {
    throw Error("Illegal arguments for DoorPrefab: '" +
        [x0, y0, x1, y1].join() +
        " Either the x's or the y's have to be the same.");
  }
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.closed = closed;
}

DoorPrefab.TOP_SPEED = 0.3;
DoorPrefab.ACCEL = 0.02;
DoorPrefab.MIN_CLOSEDNESS = 0.03;

DoorPrefab.prototype.createSprites = function(vorp) {
  var x0 = this.x0;
  var y0 = this.y0;
  var x1 = this.x1;
  var y1 = this.y1;
  var phy = vorp.phy;

  var thickness = Prefab.WALL_RADIUS * 0.4;
  var closedness = this.closed ? 1 : DoorPrefab.MIN_CLOSEDNESS;
  function mid(a, b) {
    return (a + b) / 2;
  }
  if (x0 == x1) {
    // vertical
    this.door0 = new DoorSprite(phy, new RectPainter("#aaa"),
        x0, y0 + Prefab.WALL_RADIUS, x0, mid(y0, y1), thickness, closedness,
        DoorPrefab.TOP_SPEED, DoorPrefab.ACCEL);
    this.door1 = new DoorSprite(phy, new RectPainter("#aaa"),
        x1, y1 - Prefab.WALL_RADIUS, x1, mid(y0, y1), thickness, closedness,
        DoorPrefab.TOP_SPEED, DoorPrefab.ACCEL);
  } else {
    // horizontal
    this.door0 = new DoorSprite(phy, new RectPainter("#aaa"),
        x0 + Prefab.WALL_RADIUS, y0, mid(x0, x1), y0, thickness, closedness,
        DoorPrefab.TOP_SPEED, DoorPrefab.ACCEL);
    this.door1 = new DoorSprite(phy, new RectPainter("#aaa"),
        x1 - Prefab.WALL_RADIUS, y1, mid(x0, x1), y1, thickness, closedness,
        DoorPrefab.TOP_SPEED, DoorPrefab.ACCEL);
  }
  return [this.door0, this.door1];
};

DoorPrefab.prototype.setClosed = function(closed) {
  this.closed = closed;
  this.door0.destClosedness = this.door1.destClosedness = (this.closed ? 1 : DoorPrefab.MIN_CLOSEDNESS);
};
