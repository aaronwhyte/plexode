/**
 * Top level class for the Vorp EDitor.
 * @param {Element} rootNode
 * @param {Stor} stor
 * @param {Object=} opt_testLevelMap
 * @constructor
 */
function VedApp(rootNode, stor, opt_testLevelMap) {
  this.rootNode = rootNode;
  this.stor = stor;
  this.testLevelMap = opt_testLevelMap || {};
  this.listeningToHashChanges = false;
}

VedApp.CLIPBOARD_STORAGE_KEY = 'vedClipBoard';

/**
 * @enum {string}
 */
VedApp.Params = {
  MODE: 'mode',
  LEVEL: 'level'
};

/**
 * @enum {string}
 */
VedApp.Mode = {
  EDIT: 'edit',
  PLAY: 'play',
  JSON: 'json'
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
  this.rootNode.innerHTML = '';
  this.rootNode.appendChild(appDiv);

  var hash = plex.url.getFragment();
  var query = plex.url.decodeQuery(hash);
  var level = query[VedApp.Params.LEVEL];
  var mode = query[VedApp.Params.MODE];

  if (mode == VedApp.Mode.PLAY) {
    this.renderPlayMode(appDiv, level);
  } else if (mode == VedApp.Mode.EDIT) {
    this.renderEditMode(appDiv, level);
  } else if (mode == VedApp.Mode.JSON) {
    this.renderJsonMode(appDiv, level);
  } else {
    this.renderDirectory(appDiv);
  }
};

VedApp.prototype.getHashChangeListener = function() {
  var self = this;
  return function() {
    self.render();
  };
};

VedApp.prototype.renderDirectory = function(appDiv) {

  // list of levels
  var levelNames = this.stor.getNames();
  levelNames.sort();
  for (var i = 0; i < levelNames.length; i++) {
    var levelName = levelNames[i];
    var levelDiv = plex.dom.ce('div', appDiv);
    plex.dom.appendClass(levelDiv, 'vedDirectoryRow');

    var editLink = plex.dom.ce('a', levelDiv);
    editLink.href = '#' + plex.url.encodeQuery({
      mode: VedApp.Mode.EDIT,
      level: levelName
    });
    plex.dom.ct(levelName || ' ', editLink);
    plex.dom.appendClass(editLink, 'vedNavLink');
  }

  plex.dom.ce('br', appDiv);

  // for callbacks
  var self = this;

  // create level button
  var createButton = plex.dom.ce('button', appDiv);
  plex.dom.appendClass(createButton, 'vedButton');
  plex.dom.ct('Create new level', createButton);
  createButton.onclick = function() {
    self.createLevel();
    self.render();
  };

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


VedApp.prototype.renderLevelHeader = function(appDiv, levelName, renderMode) {
  var leftLink = plex.dom.ce('a', appDiv);
  leftLink.href = '#';
  leftLink.innerHTML = '&laquo;';
  leftLink.className = 'vedLeftLink';
  //plex.dom.appendClass(parentLink, 'vedNavLink');

  // left link
  var modesDiv = plex.dom.ce('div', appDiv);
  modesDiv.className = 'vedModesDiv';

  // right mode switches
  for (var k in VedApp.Mode) {
    var mode = VedApp.Mode[k];
    var modeElem;
    if (renderMode == mode) {
      modeElem = plex.dom.ce('span', modesDiv);
    } else {
      modeElem = plex.dom.ce('a', modesDiv);
      modeElem.href = '#' + plex.url.encodeQuery({
        mode: mode,
        level: levelName
      });
      modeElem.onclick = this.getModeLinkFn(mode, levelName);
    }
    modeElem.className = 'vedModeLink';
    plex.dom.ct(mode, modeElem);
  }

  // title
  var titleSpan = plex.dom.ce('span', appDiv);
  titleSpan.className = 'vedEditTitle';
  plex.dom.ct(levelName, titleSpan);
};

VedApp.prototype.getModeLinkFn = function(mode, levelName) {
  var self = this;
  return function(event) {
    event.preventDefault();
    var href = '#' + plex.url.encodeQuery({
      mode: mode,
      level: levelName
    });
    history.replaceState(null, document.title, href);
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

VedApp.prototype.renderEditMode = function(appDiv, levelName) {
  this.renderLevelHeader(appDiv, levelName, VedApp.Mode.EDIT);
  if (this.maybeRenderLevelNotFound(appDiv, levelName)) return;

  var plexKeys = new plex.Keys();
  var grafUiKeyCombos = new GrafUiKeyCombos(plexKeys);
  this.renderHelp(appDiv, plexKeys, grafUiKeyCombos);
  var clipboard = this.createClipboard(appDiv);
  var grafUi = this.createGrafUi(appDiv, levelName, clipboard, grafUiKeyCombos);
  grafUi.startLoop();
  this.looper = grafUi;
};

VedApp.prototype.renderHelp = function(appDiv, plexKeys, grafUiKeyCombos) {
  var wrapper = plex.dom.ce('div', appDiv);
  wrapper.id = 'gedHelpWrapper';
  wrapper.style.display = 'none';
  var gedHelp = new GedHelp(GedMsgs, plexKeys, grafUiKeyCombos);
  wrapper.innerHTML = gedHelp.formatHtml();

  var toggle = plex.dom.ce('button', appDiv);
  toggle.id = 'gedHelpToggle';
  toggle.onclick = this.getToggleFunc(wrapper.id);
  toggle.innerHTML = GedMsgs.help.HELP;
};

VedApp.prototype.getToggleFunc = function(idToToggle) {
  return function() {
    var helpDiv = document.getElementById(idToToggle);
    helpDiv.style.display = helpDiv.style.display == 'none' ? 'block' : 'none';
  };
};

VedApp.prototype.renderSysClipWrapper = function(appDiv) {
  var wrapper = plex.dom.ce('div', appDiv);
  wrapper.id = 'gedSysClipsWrapper';
  wrapper.style.display = 'none';

  var toggle = plex.dom.ce('button', appDiv);
  toggle.id = 'gedSysClipsToggle';
  toggle.onclick = this.getToggleFunc(wrapper.id);
  toggle.innerHTML = GedMsgs.TOGGLE_CLIP_MENU;
  return wrapper;
};

VedApp.prototype.createGrafUi = function(appDiv, levelName, clipboard, grafUiKeyCombos) {
  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.className = 'vedEditCanvas';
  var grafEd = GrafEd.createFromOpStor(new OpStor(this.stor, levelName));
  var model = grafEd.getModel();
  var camera = new Camera();
  var renderer = new Renderer(canvas, camera);
  var plugin = new VedUiPlugin(renderer);

  var pluginFactory = {
    create: function(renderer) {
      return new VedUiPlugin(renderer);
    }
  };
  var clipMenu = new ClipMenu(
      VedSysClipListBuilder.createDefaultInstance(),
      pluginFactory,
      this.renderSysClipWrapper(appDiv));
  var grafGeom = new GrafGeom(model);
  var grafRend = new GrafRend(plugin, renderer, grafGeom);
  return new GrafUi(grafEd, renderer, grafRend, grafGeom, plugin,
      clipboard, clipMenu,
      grafUiKeyCombos);
};

VedApp.prototype.createClipboard = function(appDiv) {
  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.className = 'vedClipboard';
  canvas.height = 100;
  canvas.width = 100;
  var model = new GrafModel();
  var camera = new Camera();
  var renderer = new Renderer(canvas, camera);
  var grafGeom = new GrafGeom(model);
  var plugin = new VedUiPlugin(renderer);
  var grafRend = new GrafRend(plugin, renderer, grafGeom);
  return new Clipboard(grafRend, localStorage, VedApp.CLIPBOARD_STORAGE_KEY);
};

VedApp.prototype.renderPlayMode = function(appDiv, levelName) {
  this.renderLevelHeader(appDiv, levelName, VedApp.Mode.PLAY);
  if (this.maybeRenderLevelNotFound(appDiv, levelName)) return;

  // hacky fake header/footer to restrict the canvas positioning
  // TODO: better canvas resize cues, maybe owned by the renderer
  var fakeHeader = plex.dom.ce('div', appDiv);
  fakeHeader.id = 'levelHeader';
  var fakeFooter = plex.dom.ce('div', appDiv);
  fakeFooter.id = 'levelFooter';

  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.id = 'canvas';

  // get level graf
  var opStor = new OpStor(this.stor, levelName);
  var levelValues = opStor.getValuesAfterIndex(-1);
  var grafModel = new GrafModel();
  for (var i = 0; i < levelValues.length; i++) {
    grafModel.applyOp(levelValues[i][OpStor.field.OP]);
  }
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

VedApp.prototype.renderJsonMode = function(appDiv, levelName) {
  this.renderLevelHeader(appDiv, levelName, VedApp.Mode.JSON);
  if (this.maybeRenderLevelNotFound(appDiv, levelName)) return;

  var grafEd = GrafEd.createFromOpStor(new OpStor(this.stor, levelName));
  var model = grafEd.getModel();
  var div = plex.dom.ce('div', appDiv);
  div.style.clear = 'both';
  div.style.fontSize = 'small';
  div.className = 'selectable';
  var ops = model.createOps();
//  var html = plex.string.textToHtml(JSON.stringify(ops));
  var html = plex.string.textToHtml(JSON.stringify(ops, null, "  "));
  html = plex.string.replace(html, "  ", "&nbsp; ");
  html = plex.string.replace(html, "\n", "<br>");
  div.innerHTML = html;
};


VedApp.prototype.createLevel = function() {
  function pad(str, size) {
    str = String(str);
    while (str.length < size) {
      str = '0' + str;
    }
    return str;
  }
  var levelName = prompt("New level name?");
  if (levelName) {
    var opStor = new OpStor(this.stor, levelName);
    opStor.touch();
  }
};

VedApp.prototype.nuke = function() {
  // TODO: stor.deleteAll()
  // TODO: stor.deleteName(name)
  localStorage.clear();
};

VedApp.prototype.repopulate = function() {
  for (var levelName in this.testLevelMap) {
    var opStor = new OpStor(this.stor, levelName);
    var ops = this.testLevelMap[levelName];
    for (var i = 0; i < ops.length; i++) {
      opStor.appendOp('repop_' + i, ops[i]);
    }
  }
};

