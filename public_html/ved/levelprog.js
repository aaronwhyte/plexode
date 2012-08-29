/**
 * Level editor API for programatic level creation, without an editor UI.
 * @constructor
 * @extends {LevelEd}
 */
function LevelProg(model, sysClips) {
  LevelEd.call(this, model);
  this.sysClips = sysClips;
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

LevelProg.prototype.mono = function(type, x1, y1, opt_tuples) {
  var idMap = this.pasteWithOffset(this.sysClips.getClipById(type).grafModel, new Vec2d(x1, y1));
  if (opt_tuples) {
    this.setDataTuples(opt_tuples, idMap);
  }
};

LevelProg.prototype.link = function(outputPartPos, inputPartPos) {
  this.clearSelection();
  this.selectNearest(this.getJackOffset(false).add(outputPartPos), true);
  this.selectNearest(this.getJackOffset(true).add(inputPartPos), true);
  this.linkSelectedJacks();
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

/**
 * @param {GrafModel} model
 * @param {Array<Vec2d>} positions
 * @return a map from the clipModel IDs to the level's model IDs
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
  var ops = tempModel.createOps();
  var idMap = this.model.rewriteOpIds(ops);
  this.model.applyOps(ops);
  return idMap;
};

/**
 * @param tuples An array of [objId, key, value] arrays.
 */
LevelProg.prototype.setDataTuples = function(tuples, opt_idMap) {
  // TODO: replace this setDataOnSelected which scans selected items for the keys,
  // and only overwrites when those key exist.
  for (var i in tuples) {
    var tuple = tuples[i];
    var objId = opt_idMap ? opt_idMap[tuple[0]] : tuple[0];
    var key = tuple[1];
    var val = tuple[2];
    this.setDataById(objId, key, val);
  }
};
