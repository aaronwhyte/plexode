/**
 * Top level class for the Vorp EDitor.
 * @constructor
 */
function VedApp(rootNode, stor, opt_testLevelMap) {
  this.rootNode = rootNode;
  this.stor = stor;
  this.testLevelMap = opt_testLevelMap || {};
  this.listeningToHashChanges = false;
}

/**
 * @type {enum}
 */
VedApp.Mode = {
  EDITING: 'editing',
  TESTING: 'testing'
};

/**
 * @type {enum}
 */
VedApp.Params = {
  MODE: 'mode',
  LEVEL: 'level'
};

VedApp.prototype.render = function() {

  if (!this.listeningToHashChanges) {
    plex.event.addListener(window, 'hashchange', this.getHashChangeListener());
    this.listeningToHashChanges = true;
  }

  // Stop any running timer loops instance.
  if (this.vorp) {
    this.vorp.stopLoop();
    this.vorp = null;
  }

  // out-of-dom fragment to prevent rerendering as we go
  // (no idea if that really works)
  var appDiv = plex.dom.ce('div');

  var hash = plex.url.getFragment();
  var query = plex.url.decodeQuery(hash);
  var level = query[VedApp.Params.LEVEL];
  var mode = query[VedApp.Params.MODE];
  if (mode == VedApp.Mode.TESTING) {
    this.renderTesting(appDiv, level);
  } else if (mode == VedApp.Mode.EDITING) {
    this.renderEditing(appDiv, level);
  } else {
    this.renderDirectory(appDiv);
  }

  // put it all in the DOM
  this.rootNode.innerHTML = '';
  this.rootNode.appendChild(appDiv);
};

VedApp.prototype.getHashChangeListener = function() {
  var self = this;
  return function() {
    self.render();
  };
};

VedApp.prototype.renderDirectory = function(appDiv) {
  // nuke button
  var nukeButton = plex.dom.ce('button', appDiv);
  plex.dom.ct('Nuke and repopulate', nukeButton);
  var self = this;
  nukeButton.onclick = function() {
    self.nuke();
    self.repopulate(); // vorpLevels is populated by levels
    self.render();
  };

  plex.dom.ce('hr', appDiv);

  // list of levels
  var levelNames = this.stor.getNames();
  for (var i = 0; i < levelNames.length; i++) {
    var levelName = levelNames[i];
    var levelDiv = plex.dom.ce('div', appDiv);
    plex.dom.appendClass(levelDiv, 'directoryRow');

    var editLink = plex.dom.ce('a', levelDiv);
    editLink.href = '#' + plex.url.encodeQuery({
      mode: VedApp.Mode.EDITING,
      level: levelName
    });
    plex.dom.ct('edit', editLink);
    plex.dom.appendClass(editLink, 'directoryLink');

    var testLink = plex.dom.ce('a', levelDiv);
    testLink.href = '#' + plex.url.encodeQuery({
      mode: VedApp.Mode.TESTING,
      level: levelName
    });
    plex.dom.ct('test', testLink);
    plex.dom.appendClass(testLink, 'directoryLink');

    plex.dom.ct(levelName, levelDiv);
  }
};

VedApp.prototype.renderEditing = function(appDiv, levelName) {
  plex.dom.ct('editing ' + levelName, appDiv);
};

VedApp.prototype.renderTesting = function(appDiv, levelName) {
  plex.dom.ct('testing ' + levelName, appDiv);
  plex.dom.ce('br', appDiv);
  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.height = 600;
  canvas.width = 600;

  // get level graf
  var opStor = new OpStor(this.stor, levelName);
  var levelOps = opStor.getOpsAfterIndex(-1);
  var grafModel = new GrafModel();
  grafModel.applyOps(levelOps);

  // create vorp instance
  var renderer = new Renderer(canvas, new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);

  // Use Transformer to populate Vorp with Model.
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(grafModel);

  // Start the game up.
  vorp.startLoop();
  this.vorp = vorp;
};

VedApp.prototype.nuke = function() {
  // TODO: stor.deleteAll()
  // TODO: stor.deleteName(name)
  localStorage.clear();
};

VedApp.prototype.repopulate = function() {
  for (var levelName in this.testLevelMap) {
    this.stor.appendValues(levelName, this.testLevelMap[levelName]);
  }
};

