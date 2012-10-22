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
VedApp.Params = {
  MODE: 'mode',
  LEVEL: 'level'
};

/**
 * @type {enum}
 */
VedApp.Mode = {
  EDIT: 'edit',
  TEST: 'test'
};

VedApp.prototype.render = function() {

  if (!this.listeningToHashChanges) {
    plex.event.addListener(window, 'hashchange', this.getHashChangeListener());
    this.listeningToHashChanges = true;
  }

  // Stop any running timer loops instance.
  if (this.looper) {
    this.looper.stopLoop();
    this.looper = null;
  }

  // out-of-dom fragment to prevent rerendering as we go
  // (no idea if that really works)
  var appDiv = plex.dom.ce('div');

  var hash = plex.url.getFragment();
  var query = plex.url.decodeQuery(hash);
  var level = query[VedApp.Params.LEVEL];
  var mode = query[VedApp.Params.MODE];

  if (mode == VedApp.Mode.TEST) {
    this.renderTesting(appDiv, level);
  } else if (mode == VedApp.Mode.EDIT) {
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

VedApp.prototype.renderTopNav = function(appDiv, text, parentText, parentQuery) {
  function slash() {
    var slashSpan = plex.dom.ce('span', appDiv);
    plex.dom.ct(" / ", slashSpan);
  }
  if (parentQuery) {
    slash();
    var parentLink = plex.dom.ce('a', appDiv);
    parentLink.href = '#' + plex.url.encodeQuery(parentQuery);
    plex.dom.ct(parentText, parentLink);
    //plex.dom.appendClass(parentLink, 'vedNavLink');
  }
  slash();
  var locSpan = plex.dom.ce('span', appDiv);
  plex.dom.ct(text, locSpan);
};

VedApp.prototype.renderDirectory = function(appDiv) {

  // list of levels
  var levelNames = this.stor.getNames();
  for (var i = 0; i < levelNames.length; i++) {
    var levelName = levelNames[i];
    var levelDiv = plex.dom.ce('div', appDiv);
    plex.dom.appendClass(levelDiv, 'vedDirectoryRow');

    var editLink = plex.dom.ce('a', levelDiv);
    editLink.href = '#' + plex.url.encodeQuery({
      mode: VedApp.Mode.EDIT,
      level: levelName
    });
    plex.dom.ct('edit', editLink);
    plex.dom.appendClass(editLink, 'vedNavLink');

    var testLink = plex.dom.ce('a', levelDiv);
    testLink.href = '#' + plex.url.encodeQuery({
      mode: VedApp.Mode.TEST,
      level: levelName
    });
    plex.dom.ct('test', testLink);
    plex.dom.appendClass(testLink, 'vedNavLink');

    plex.dom.ct(levelName, levelDiv);
  }

  plex.dom.ce('br', appDiv);

  // for callbacks
  var self = this;

  // nuke button
  var nukeButton = plex.dom.ce('button', appDiv);
  plex.dom.appendClass(nukeButton, 'vedButton');
  plex.dom.ct('Clear ' + window.location.host + ' localStorage', nukeButton);
  nukeButton.onclick = function() {
    self.nuke();
    self.render();
  };
  // repopulate button
  var repopulateButton = plex.dom.ce('button', appDiv);
  plex.dom.appendClass(repopulateButton, 'vedButton');
  plex.dom.ct('Populate localStorage', repopulateButton);
  repopulateButton.onclick = function() {
    self.repopulate(); // vorpLevels is populated by levels
    self.render();
  };
};


VedApp.prototype.maybeRenderLevelNotFound = function(appDiv, levelName) {
  if (plex.array.contains(this.stor.getNames(), levelName)) {
    return false;
  }
  var errorDiv = plex.dom.ce('div', appDiv);
  plex.dom.appendClass(errorDiv, 'vedError');
  plex.dom.ct('The level "' + levelName + '" was not found in localStorage.', errorDiv);
  return true;
};

VedApp.prototype.renderEditing = function(appDiv, levelName) {
  this.renderTopNav(appDiv, 'editing - ' + levelName, 'directory', {});
  if (this.maybeRenderLevelNotFound(appDiv, levelName)) return;

  plex.dom.ce('br', appDiv);
  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.height = 600;
  canvas.width = 600;

  // Generate LevelEd
  var grafEd = GrafEd.createFromOpStor(new OpStor(this.stor, levelName));

  // renderer is shared by vorp and grafUi
  var camera = new Camera();
  camera.setZoom(0.2);
  var renderer = new Renderer(canvas, camera);
  var plugin = new VedUiPlugin(renderer);
  var grafUi = new GrafUi(grafEd, renderer, plugin);

  grafUi.startLoop();
  this.looper = grafUi;
};

VedApp.prototype.renderTesting = function(appDiv, levelName) {
  this.renderTopNav(appDiv, 'testing - ' + levelName, 'directory', {});
  if (this.maybeRenderLevelNotFound(appDiv, levelName)) return;

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
  this.looper = vorp;
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

