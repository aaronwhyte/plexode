/**
 * Top level class for the Vorp EDitor.
 * @param {Element} rootNode
 * @param {Stor} stor
 * @constructor
 */
function VedApp(rootNode, stor) {
  this.rootNode = rootNode;
  this.stor = stor;
  this.listeningToHashChanges = false;
  this.squisher = new plex.Squisher(VedApp.DICT);
}

VedApp.DICT = [
  '"type":', '"id":', '"key":', '"value":',
  '"clusterId":', '"partId":', '"jackId1":', '"jackId2":', '"x":', '"y":',
  '"addCluster"', '"setData"', '"addPart"', '"addJack"', '"addLink"',
  '"input"', '"output"', '"name"', '"wall"', 'player', 'assembler', 'zombie', 'block',
  '},{'
];

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
  SHARE: 'share',
  JSON: 'json'
};

VedApp.LevelPrefix = {
  BUILTIN: 'builtin~',
  LOCAL: 'local~',
  DATA: 'data~'
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
  var mode = query[VedApp.Params.MODE];
  var level = query[VedApp.Params.LEVEL];
  if (!level) {
    for (var key in query) {
      if (!query[key]) {
        // The "default key" is level, and level becomes the value.
        level = key;
      }
    }
  }

  if (level && !mode) {
    mode = VedApp.Mode.PLAY;
  }

  if (mode == VedApp.Mode.PLAY) {
    this.renderPlayMode(appDiv, level);
  } else if (mode == VedApp.Mode.EDIT) {
    this.renderEditMode(appDiv, level);
  } else if (mode == VedApp.Mode.SHARE) {
    this.renderShareMode(appDiv, level);
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

  function renderRow(levelAddress) {
    var levelDiv = plex.dom.ce('div', appDiv);
    plex.dom.appendClass(levelDiv, 'vedDirectoryRow');

    var playLink = plex.dom.ce('a', levelDiv);
    playLink.href = '#' + encodeURIComponent(levelAddress);
    plex.dom.ct(levelAddress || ' ', playLink);
    plex.dom.appendClass(playLink, 'vedNavLink');
  }

  // builtin levels
  var levelAddresss = plex.object.keys(vorpLevels);
  levelAddresss.sort();
  for (var i = 0; i < levelAddresss.length; i++) {
    renderRow(levelAddresss[i]);
  }

  // local levels
  var localNames = this.stor.getNames();
  localNames.sort();
  for (var i = 0; i < localNames.length; i++) {
    renderRow(VedApp.LevelPrefix.LOCAL + localNames[i]);
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
};


VedApp.prototype.renderLevelHeader = function(appDiv, levelAddress, renderMode) {
  var leftLink = plex.dom.ce('a', appDiv);
  leftLink.href = '#';
  leftLink.innerHTML = '&laquo;';
  leftLink.className = 'vedLeftLink';

  // left link
  var modesDiv = plex.dom.ce('div', appDiv);
  modesDiv.className = 'vedModesDiv';

  // right mode switches
  var order = [
    VedApp.Mode.PLAY,
    VedApp.Mode.EDIT,
    VedApp.Mode.SHARE,
    VedApp.Mode.JSON];
  for (var i = 0; i < order.length; i++) {
    var mode = order[i];
    var modeElem;
    if (renderMode == mode) {
      modeElem = plex.dom.ce('span', modesDiv);
    } else {
      modeElem = plex.dom.ce('a', modesDiv);
      modeElem.href = '#' + plex.url.encodeQuery({
        mode: mode,
        level: levelAddress
      });
      modeElem.onclick = this.getModeLinkFn(mode, levelAddress);
    }
    modeElem.className = 'vedModeLink';
    plex.dom.ct(mode, modeElem);
  }

  // title
  var titleSpan = plex.dom.ce('span', appDiv);
  titleSpan.className = 'vedLevelTitle';
  if (levelAddress.indexOf(VedApp.LevelPrefix.DATA) == 0) {
    if (levelAddress.length > 45) {
      levelAddress = levelAddress.substring(0, 20) + '...' +
          levelAddress.substring(levelAddress.length - 20);
    }
  }
  plex.dom.ct(levelAddress, titleSpan);
};

VedApp.prototype.getModeLinkFn = function(mode, levelAddress) {
  var self = this;
  return function(event) {
    event.preventDefault();
    var href = '#' + plex.url.encodeQuery({
      mode: mode,
      level: levelAddress
    });
    history.replaceState(null, document.title, href);
    self.render();
  };
};

VedApp.prototype.splitLevelAddress = function(levelAddress) {
  for (var key in VedApp.LevelPrefix) {
    var prefix = VedApp.LevelPrefix[key];
    if (levelAddress.indexOf(prefix) == 0 && levelAddress.length > prefix.length) {
      return [prefix, levelAddress.substring(prefix.length)];
    }
  }
  // default prefix is BUILTIN
  return [VedApp.LevelPrefix.BUILTIN, levelAddress];
};

VedApp.prototype.getOpsForLevelAddress = function(levelAddress) {
  var ops;
  var split = this.splitLevelAddress(levelAddress);
  var levelPrefix = split[0];
  var name = split[1];
  if (levelPrefix == VedApp.LevelPrefix.BUILTIN) {
    ops = vorpLevels[name];
  } else if (levelPrefix == VedApp.LevelPrefix.LOCAL) {
    var opStor = new OpStor(this.stor, name);
    ops = opStor.getValuesAfterIndex(-1);
  } else if (levelPrefix == VedApp.LevelPrefix.DATA) {
    var json = this.squisher.unsquish(name);
    ops = JSON.parse(json);
  }
  return ops || [];
};

VedApp.prototype.maybeRenderLevelNotFound = function(appDiv, levelAddress) {
  var splitName = this.splitLevelAddress(levelAddress);
  if (splitName[0] == VedApp.LevelPrefix.BUILTIN) {
    if (vorpLevels[splitName[1]]) {
      return false;
    }
  } else if (splitName[0] == VedApp.LevelPrefix.LOCAL) {
    if (plex.array.contains(this.stor.getNames(), splitName[1])) {
      return false;
    }
  } else if (splitName[0] == VedApp.LevelPrefix.DATA) {
    return false;
  }
  var errorDiv = plex.dom.ce('div', appDiv);
  plex.dom.appendClass(errorDiv, 'vedError');
  plex.dom.ct('The level "' + levelAddress + '" was not found.', errorDiv);
  return true;
};

VedApp.prototype.renderEditMode = function(appDiv, levelAddress) {
  this.renderLevelHeader(appDiv, levelAddress, VedApp.Mode.EDIT);
  if (this.maybeRenderLevelNotFound(appDiv, levelAddress)) return;

  var splitName = this.splitLevelAddress(levelAddress);
  if (splitName[0] == VedApp.LevelPrefix.LOCAL) {
    var plexKeys = new plex.Keys();
    var grafUiKeyCombos = new GrafUiKeyCombos(plexKeys);
    this.renderHelp(appDiv, plexKeys, grafUiKeyCombos);
    var clipboard = this.createClipboard(appDiv);
    var grafUi = this.createGrafUi(appDiv, splitName[1], clipboard, grafUiKeyCombos);
    grafUi.startLoop();
    this.looper = grafUi;
  }
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

VedApp.prototype.createVorpFromOps = function(ops) {
  var grafModel = new GrafModel();
  for (var i = 0; i < ops.length; i++) {
    // TODO pull actual ops out of opstore jazz before calling createVorpFromOps.
    grafModel.applyOp(ops[i][OpStor.field.OP] || ops[i]);
  }
  // create vorp instance
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorpOut = new VorpOut(new Renderer(canvas, new Camera()), SoundFx.createInstance());
  var vorp = Vorp.createVorp(vorpOut, gameClock, sledgeInvalidator);

  // Use Transformer to populate Vorp with Model.
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(grafModel);
  return vorp;
};

VedApp.prototype.renderPlayMode = function(appDiv, levelAddress) {
  this.renderLevelHeader(appDiv, levelAddress, VedApp.Mode.PLAY);
  if (this.maybeRenderLevelNotFound(appDiv, levelAddress)) return;
  var ops = this.getOpsForLevelAddress(levelAddress);

  // hacky fake header/footer to restrict the canvas positioning
  // TODO: better canvas resize cues, maybe owned by the renderer
  var fakeHeader = plex.dom.ce('div', appDiv);
  fakeHeader.id = 'levelHeader';
  var fakeFooter = plex.dom.ce('div', appDiv);
  fakeFooter.id = 'levelFooter';

  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.id = 'canvas';

  // Start the game up.
  var vorp = this.createVorpFromOps(ops);
  vorp.startLoop();
  this.looper = vorp;
};

VedApp.prototype.renderShareMode = function(appDiv, levelAddress) {
  this.renderLevelHeader(appDiv, levelAddress, VedApp.Mode.SHARE);
  if (this.maybeRenderLevelNotFound(appDiv, levelAddress)) return;
  var ops = this.getOpsForLevelAddress(levelAddress);
  var json = JSON.stringify(ops); // compact JSON, nor prety printed
  var base64 = this.squisher.squish(json);
  // The "level=" prefix must be included, to prevent the first "=" sign
  // in the data from being interpreted as a key/value separator.
  var url = [
      location.origin, location.pathname, '#',
      VedApp.Params.LEVEL, '=', VedApp.LevelPrefix.DATA, base64].join('');
  var div = plex.dom.ce('div', appDiv);
  div.style.clear = 'both';
  div.style.fontSize = 'small';
  div.className = 'selectable';
  div.style.wordWrap = 'break-word';
  var html = plex.string.textToHtml(url);
  div.innerHTML = html;
};

VedApp.prototype.renderJsonMode = function(appDiv, levelAddress) {
  this.renderLevelHeader(appDiv, levelAddress, VedApp.Mode.JSON);
  if (this.maybeRenderLevelNotFound(appDiv, levelAddress)) return;
  var ops = this.getOpsForLevelAddress(levelAddress);
  var div = plex.dom.ce('div', appDiv);
  div.style.clear = 'both';
  div.style.fontSize = 'small';
  div.className = 'selectable';
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
  var newName = prompt("New level name?");
  if (newName) {
    var opStor = new OpStor(this.stor, newName);
    opStor.touch();
  }
};
