/**
 * @constructor
 */
function DoorPrefab(x0, y0, x1, y1, closed) {
  Prefab.call(this);
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
DoorPrefab.prototype = new Prefab();
DoorPrefab.prototype.constructor = Prefab;

DoorPrefab.TOP_SPEED = 0.3;
DoorPrefab.ACCEL = 0.02;
DoorPrefab.MIN_CLOSEDNESS = 0.03;

DoorPrefab.prototype.createSprites = function(baseSpriteTemplate) {
  this.baseSpriteTemplate = baseSpriteTemplate;
  var x0 = this.x0;
  var y0 = this.y0;
  var x1 = this.x1;
  var y1 = this.y1;

  var thickness = Prefab.WALL_RADIUS * 0.4;
  var closedness = this.closed ? 1 : DoorPrefab.MIN_CLOSEDNESS;
  function mid(a, b) {
    return (a + b) / 2;
  }
  var spriteTemplate = new SpriteTemplate()
      .setGameClock(gameClock)
      .setSledgeInvalidator(sledgeInvalidator)
      .setMass(Infinity)
      .setGroup(Vorp.WALL_GROUP)
      .setSledgeDuration(1.01);
  
  function createDoorSprite(x0, y0, x1, y1) {
    spriteTemplate.setPainter(new RectPainter("#aaa"));
    return new DoorSprite(spriteTemplate, x0, y0, x1, y1, thickness, closedness,
        DoorPrefab.TOP_SPEED, DoorPrefab.ACCEL);
  }
  if (x0 == x1) {
    // vertical
    this.door0 = createDoorSprite(x0, y0 + Prefab.WALL_RADIUS, x0, mid(y0, y1));
    this.door1 = createDoorSprite(x1, y1 - Prefab.WALL_RADIUS, x1, mid(y0, y1));
  } else {
    // horizontal
    this.door0 = createDoorSprite(x0 + Prefab.WALL_RADIUS, y0, mid(x0, x1), y0);
    this.door1 = createDoorSprite(x1 - Prefab.WALL_RADIUS, y1, mid(x0, x1), y1);
  }
  return [this.door0, this.door1];
};

DoorPrefab.prototype.setClosed = function(closed) {
  this.closed = closed;
  this.door0.destClosedness = this.door1.destClosedness = (this.closed ? 1 : DoorPrefab.MIN_CLOSEDNESS);
};
