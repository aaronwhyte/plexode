/**
 * Level editor API for programatic level creation, without an editor UI.
 * @constructor
 * @extends {LevelEd}
 */
function LevelProg(model, sysClips) {
  LevelEd.call(this, model);
  this.sysClips = sysClips;

  // Vec2d
  this.wallCursor = null;
}
LevelProg.prototype = new LevelEd(null);
LevelProg.prototype.constructor = LevelEd;

/**
 * Creates a normal everyday good old fashioned LevelProg instance.
 * @return {LevelProg}
 */
LevelProg.create = function() {
  return new LevelProg(new GrafModel(), SysClipListBuilder.createDefaultInstance());
};

LevelProg.prototype.wall = function(x1, y1, x2, y2) {
  this.pasteWithPositions(this.sysClips.getClipById(VedType.WALL).grafModel, [new Vec2d(x1, y1), new Vec2d(x2, y2)]);
};

LevelProg.prototype.wallStart = function(x, y) {
  this.wallCursor = new Vec2d(x, y);
  return this;
};

LevelProg.prototype.wallToXY = function(x, y) {
  this.wall(this.wallCursor.x, this.wallCursor.y, x, y);
  this.wallCursor.setXY(x, y);
  return this;
};

LevelProg.prototype.wallToX = function(x) {
  return this.wallToXY(x, this.wallCursor.y);
};

LevelProg.prototype.wallToY = function(y) {
  return this.wallToXY(this.wallCursor.x, y);
};

/**
 * @param {VedType} type
 * @param {number} x
 * @param {number} y
 * @param {Object=} opt_data optional object with key/value pairs to set on the pasted model objects.
 * @return {Vec2d} vector at x, y
 */
LevelProg.prototype.mono = function(type, x, y, opt_data) {
  this.pasteWithOffset(this.sysClips.getClipById(type).grafModel, new Vec2d(x, y));
  opt_data && this.setDataOnSelection(opt_data);
  return new Vec2d(x, y);
};

/**
 * @param {VedType} type
 * @param {Object=} opt_data optional object with key/value pairs to set on the pasted model objects.
 */
LevelProg.prototype.double = function(type, x1, y1, x2, y2, opt_data) {
  this.pasteWithPositions(this.sysClips.getClipById(type).grafModel, [new Vec2d(x1, y1), new Vec2d(x2, y2)]);
  opt_data && this.setDataOnSelection(opt_data);
};

LevelProg.prototype.link = function(outputPartPos, inputPartPos) {
  this.clearSelection();
  this.selectNearest(this.getJackOffset(false).add(outputPartPos), true);
  this.selectNearest(this.getJackOffset(true).add(inputPartPos), true);
  this.linkSelectedJacks();
};

/**
 * Pastes and moves the parts into the positions.
 * Sets the selection to be the pasted parts and jacks.
 * @param {GrafModel} model
 * @param {Array<Vec2d>} positions
 */
LevelProg.prototype.pasteWithPositions = function(model, positions) {
  var tempModel = new GrafModel();
  tempModel.addModel(model);
  var posIndex = 0;
  for (var partId in tempModel.parts) {
    var part = tempModel.parts[partId];
    part.x = positions[posIndex].x;
    part.y = positions[posIndex].y;
    posIndex++;
  }
  return this.paste(tempModel);
};

LevelProg.prototype.startVorp = function(canvas) {
  var renderer = new Renderer(canvas, new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(this.model);
  vorp.startLoop();
};

LevelProg.prototype.createOps = function() {
  return this.model.createOps();
};