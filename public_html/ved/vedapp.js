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

VedApp.DICT = ['],['];

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
  var levelAddress = query[VedApp.Params.LEVEL];
  if (!levelAddress) {
    for (var key in query) {
      if (!query[key]) {
        // The "default key" is level, and level becomes the value.
        levelAddress = key;
      }
    }
  }

  mode = mode || VedApp.Mode.PLAY;
  this.renderModeSwitch(appDiv, levelAddress, mode);
  if (!levelAddress) {
    this.renderDirectory(appDiv, mode);
  } else {
    if (this.maybeRenderLevelNotFound(appDiv, levelAddress)) return;
    this.renderLevelHeader(appDiv, levelAddress, mode);
    if (mode == VedApp.Mode.PLAY) {
      this.renderPlayMode(appDiv, levelAddress);
    } else if (mode == VedApp.Mode.EDIT) {
      this.renderEditMode(appDiv, levelAddress);
    } else if (mode == VedApp.Mode.SHARE) {
      this.renderShareMode(appDiv, levelAddress);
    } else if (mode == VedApp.Mode.JSON) {
      this.renderJsonMode(appDiv, levelAddress);
    }
  }
};

VedApp.prototype.getHashChangeListener = function() {
  var self = this;
  return function() {
    self.render();
  };
};

VedApp.prototype.renderDirectory = function(appDiv, mode) {
  var centerDiv = plex.dom.ce('div', appDiv);
  centerDiv.className = 'center';
  centerDiv.innerHTML +=
      '<div class=center>' +
      '<h1>What?</h1>' +
      'Vorp is a free 2D physics-based action/puzzle game that runs in modern web browsers.' +
      '<p>It\'s written in JavaScript, using the HTML5 &lt;canvas&gt; element to render all the graphics. ' +
      'There are few sound effects, the graphics are terrible, and you need a keyboard to play.' +
      '<p>It works well in <a href="http://www.google.com/chrome/">Chrome</a>, ' +
      '<a href="http://www.mozilla.org/firefox">Firefox</a>, ' +
      '<a href="http://www.apple.com/safari/">Safari</a>, and ' +
      '<a href="http://www.opera.com/browser">Opera</a>.<br>' +
      '<a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home">IE 9</a> and up might work.' +
      '<h1>Official Levels</h1>' +
      '</div>';

  var self = this;
  function renderRow(levelAddress) {
    var playLink = plex.dom.ce('a', centerDiv);
    playLink.href = '#' + plex.url.encodeQuery(self.createQueryObj(mode, levelAddress));
    var split = self.splitLevelAddress(levelAddress);
    var dispName = '';
    if (split[0] == VedApp.LevelPrefix.LOCAL) {
      dispName += split[1] + ' - ';
    }
    try {
      dispName += self.getTitleForLevelAddress(levelAddress);
    } catch (e) {
      console.log(e);
      dispName += 'LEVEL CORRUPTED';
    }
    plex.dom.ct(dispName, playLink);
    plex.dom.appendClass(playLink, 'vedDirectoryLink');
  }

  // builtin levels
  var levelAddresss = plex.object.keys(vorpLevels);
  levelAddresss.sort();
  for (var i = 0; i < levelAddresss.length; i++) {
    renderRow(levelAddresss[i]);
  }

  plex.dom.ce('p', centerDiv);

  // local levels
  var localNames = this.stor.getNames();
  if (localNames.length) {
    centerDiv.innerHTML += '<h1>Editable Levels</h1>';
  }
  localNames.sort();
  for (var i = 0; i < localNames.length; i++) {
    renderRow(VedApp.LevelPrefix.LOCAL + localNames[i]);
  }

  plex.dom.ce('br', centerDiv);

  // create level button
  var createButton = plex.dom.ce('button', centerDiv);
  plex.dom.appendClass(createButton, 'vedButton');
  plex.dom.ct('Create new level', createButton);
  createButton.onclick = function() {
    var newName = prompt("New level name?");
    if (!newName) {
      alert("That's not a name.");
      return;
    }
    if (self.stor.containsName(newName)) {
      alert("There's already a level with that name");
      return;
    }
    self.createLevel(newName);
    self.render();
  };
};


VedApp.prototype.createQueryObj = function(mode, levelAddress) {
  var query = {};
  if (mode != VedApp.Mode.PLAY) query[VedApp.Params.MODE] = mode;
  if (levelAddress) query[VedApp.Params.LEVEL] = levelAddress;
  return query;
};

VedApp.prototype.renderModeSwitch = function(appDiv, levelAddress, renderMode) {
  var order = [
    VedApp.Mode.PLAY,
    VedApp.Mode.EDIT];
  var modesDiv = plex.dom.ce('div', appDiv);
  modesDiv.className = 'vedModesDiv';
  for (var i = 0; i < order.length; i++) {
    var mode = order[i];
    var modeElem;
    if (renderMode == mode) {
      modeElem = plex.dom.ce('span', modesDiv);
    } else {
      modeElem = plex.dom.ce('a', modesDiv);
      modeElem.href = '#' + plex.url.encodeQuery(this.createQueryObj(mode, levelAddress));
      modeElem.onclick = this.getModeLinkFn(mode, levelAddress);
    }
    modeElem.className = 'vedModeLink';
    plex.dom.ct(mode, modeElem);
  }
};

VedApp.prototype.renderLevelHeader = function(appDiv, levelAddress, mode) {
  var leftLink = plex.dom.ce('a', appDiv);
  leftLink.href = '#' + plex.url.encodeQuery(this.createQueryObj(mode, null));
  leftLink.innerHTML = '&laquo;';
  leftLink.className = 'vedLeftLink';

  // name
  var nameSpan = plex.dom.ce('span', appDiv);
  nameSpan.className = 'vedLevelName';
  var nameText = levelAddress;
  if (nameText.indexOf(VedApp.LevelPrefix.DATA) == 0) {
    if (nameText.length > 45) {
      nameText = nameText.substring(0, 20) + '...' +
          nameText.substring(nameText.length - 20);
    }
  }
  plex.dom.ct(nameText, nameSpan);

  var metaWrapper = plex.dom.ce('div', appDiv);
  metaWrapper.className = 'vedMetaWrapper';

  this.renderMetaContent(levelAddress, mode);
};

VedApp.prototype.renderMetaContent = function(levelAddress, mode) {
  var metaWrapper = document.querySelector('.vedMetaWrapper');
  metaWrapper.innerHTML = '';

  // title
  var titleElem = plex.dom.ce('span', metaWrapper);
  titleElem.className = 'vedLevelTitle';

  // meta-data edit button
  if (mode == VedApp.Mode.EDIT) {
    var metaButtonWrap = plex.dom.ce('span', metaWrapper);
    metaButtonWrap.style.position = 'relative';
    var metaEditElem = plex.dom.ce('button', metaButtonWrap);
    metaEditElem.className = 'vedMetaEdit';
    plex.dom.ct(GrafRend.DATA_BUTTON_TEXT, metaEditElem);
  }

  // desc
  var descElem = plex.dom.ce('div', metaWrapper);
  descElem.className = 'vedLevelDesc';

  this.updateMetaContent(levelAddress);
};

VedApp.prototype.updateMetaContent = function(levelAddress) {
  document.querySelector('.vedLevelTitle').innerHTML =
      plex.string.textToHtml(this.getTitleForLevelAddress(levelAddress)) || '&nbsp;';
  document.querySelector('.vedLevelDesc').innerHTML =
      plex.string.textToHtml(this.getDescForLevelAddress(levelAddress)) || '&nbsp;';
};

VedApp.prototype.getModeLinkFn = function(mode, levelAddress) {
  var self = this;
  return function(event) {
    event && event.preventDefault();
    var href = '#' + plex.url.encodeQuery(self.createQueryObj(mode, levelAddress));
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

VedApp.prototype.getGrafForLevelAddress = function(levelAddress) {
  var ops = [];
  var split = this.splitLevelAddress(levelAddress);
  var levelPrefix = split[0];
  var name = split[1];
  if (levelPrefix == VedApp.LevelPrefix.BUILTIN) {
    ops = this.getTemplatizer().detemplatize(vorpLevels[name]);
  } else if (levelPrefix == VedApp.LevelPrefix.LOCAL) {
    var opStor = new OpStor(this.stor, name);
    ops = opStor.getValuesAfterIndex(-1);
    for (var i = 0; i < ops.length; i++) {
      ops[i] = ops[i][OpStor.field.OP];
    }
  } else if (levelPrefix == VedApp.LevelPrefix.DATA) {
    var json = this.squisher.unsquish(name);
    var paramList = JSON.parse(json);
    ops = this.getTemplatizer().detemplatize(paramList);
  }
  var graf = new GrafModel();
  graf.applyOps(ops);
  return graf;
};

VedApp.prototype.getOpsForLevelAddress = function(levelAddress) {
  return this.getGrafForLevelAddress(levelAddress).createOps();
};

VedApp.prototype.getMetaClusterForGraf = function(graf) {
  for (var id in graf.clusters) {
    var cluster = graf.getCluster(id);
    if (cluster.data['type'] == VedType.META) {
      return cluster;
    }
  }
  return null;
};

VedApp.prototype.getMetaClusterForLevelAddress = function(levelAddress) {
  var graf = this.getGrafForLevelAddress(levelAddress);
  return this.getMetaClusterForGraf(graf);
};

VedApp.prototype.getTitleForLevelAddress = function(levelAddress) {
  var mc = this.getMetaClusterForLevelAddress(levelAddress);
  return mc ? mc.data['title'] : '';
};

VedApp.prototype.getDescForLevelAddress = function(levelAddress) {
  var mc = this.getMetaClusterForLevelAddress(levelAddress);
  return mc ? mc.data['desc'] : '';
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
  var split = this.splitLevelAddress(levelAddress);
  var levelPrefix = split[0];
  var levelName = split[1];

  var self = this;

  var buttonBarElem = plex.dom.ce('div', appDiv);
  buttonBarElem.className = 'buttonBarDiv';

  // copy button
  var copyButton = plex.dom.ce('button', buttonBarElem);
  plex.dom.appendClass(copyButton, 'vedButton');
  plex.dom.ct('Copy level', copyButton);
  copyButton.onclick = function() {
    var newName = prompt("New level name?");
    if (!newName) {
      alert("That's not a name.");
      return;
    }
    if (self.stor.containsName(newName)) {
      alert("There's already a level with that name");
      return;
    }
    self.createLevel(newName, self.getOpsForLevelAddress(levelAddress));
    self.getModeLinkFn(VedApp.Mode.EDIT, VedApp.LevelPrefix.LOCAL + newName)();
  };

  if (levelPrefix == VedApp.LevelPrefix.BUILTIN) {
    var officialNotice = plex.dom.ce('span', buttonBarElem);
    officialNotice.className = 'vedEditorNotice';
    plex.dom.ct('This is an official level, not editable. You can make a local copy and edit that.',
        officialNotice);
  }

  if (levelPrefix == VedApp.LevelPrefix.DATA) {
    var officialNotice = plex.dom.ce('span', buttonBarElem);
    officialNotice.className = 'vedEditorNotice';
    plex.dom.ct('This is a data-URL level, not editable. You can make a local copy and edit that.',
        officialNotice);
  }

  // delete button
  if (levelPrefix == VedApp.LevelPrefix.LOCAL) {
    var deleteButton = plex.dom.ce('button', buttonBarElem);
    plex.dom.appendClass(deleteButton, 'vedButton');
    plex.dom.ct('Delete level', deleteButton);
    deleteButton.onclick = function() {
      if (confirm("Are you sure you want to delete this level?")) {
        var opStor = new OpStor(self.stor, levelName);
        opStor.remove();
        plex.url.setFragment(plex.url.encodeQuery(self.createQueryObj(VedApp.Mode.EDIT)));
      }
    };
  }

  var plexKeys = new plex.Keys();
  var grafUiKeyCombos = new GrafUiKeyCombos(plexKeys);
  this.renderHelp(appDiv, plexKeys, grafUiKeyCombos);
  var clipboard = this.createClipboard(appDiv);
  var grafEd, grafUi, editable;
  if (levelPrefix == VedApp.LevelPrefix.LOCAL) {
    editable = true;
    grafEd = GrafEd.createFromOpStor(new OpStor(this.stor, levelName));
  } else {
    editable = false;
    var model = new GrafModel();
    var ops = this.getOpsForLevelAddress(levelAddress);
    model.applyOps(ops);
    grafEd = new GrafEd(model);
  }
  grafUi = this.createGrafUi(appDiv, grafEd, clipboard, grafUiKeyCombos);
  grafUi.setEditable(editable);
  grafUi.startLoop();
  var metaEditElem = document.querySelector('.vedMetaEdit');
  metaEditElem.style.display = editable ? '' : 'none';
  if (editable) {
    var metaCluster = this.getMetaClusterForGraf(grafEd.model);
    metaEditElem.onclick = function() {
      grafUi.startEditingData(metaCluster.id, ['title', 'desc'], function() {
        self.updateMetaContent(levelAddress);
      });
    };
  }
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

VedApp.prototype.createGrafUi = function(appDiv, grafEd, clipboard, grafUiKeyCombos) {
  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.className = 'vedEditCanvas';
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

VedApp.prototype.createVorpFromGraf = function(graf) {
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorpOut = new VorpOut(new Renderer(canvas, new Camera()), SoundFx.createInstance());
  var vorp = Vorp.createVorp(vorpOut, gameClock, sledgeInvalidator);

  // Use Transformer to populate Vorp with Model.
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(graf);
  return vorp;
};

VedApp.prototype.renderPlayMode = function(appDiv, levelAddress) {
  var graf = this.getGrafForLevelAddress(levelAddress);

  // hacky fake header/footer to restrict the canvas positioning
  // TODO: better canvas resize cues, maybe owned by the renderer
  var fakeHeader = plex.dom.ce('div', appDiv);
  fakeHeader.id = 'levelHeader';
  var fakeFooter = plex.dom.ce('div', appDiv);
  fakeFooter.id = 'levelFooter';

  var canvas = plex.dom.ce('canvas', appDiv);
  canvas.id = 'canvas';

  // Start the game up.
  var vorp = this.createVorpFromGraf(graf);
  vorp.startLoop();
  this.looper = vorp;
};

VedApp.prototype.renumberOps = function(ops) {
  (new GrafModel()).rewriteOpIds(ops);
  return ops;
};

VedApp.prototype.getTemplatizer = function() {
  var templates = plex.object.values(VedTemplates.getClusterMap());
  plex.array.extend(templates, plex.object.values(VedTemplates.getLinkMap()));
  return new GrafTemplatizer(templates);
};

VedApp.prototype.getTemplatizedJsonForLevel = function(levelAddress) {
  var graf = new GrafModel();
  var ops = this.getOpsForLevelAddress(levelAddress);
  this.renumberOps(ops);
  graf.applyOps(ops);
  return this.getTemplatizer().templatize(graf);
};

VedApp.prototype.renderShareMode = function(appDiv, levelAddress) {
  var json = JSON.stringify(this.getTemplatizedJsonForLevel(levelAddress));
  var base64 = this.squisher.squish(json);

  var shareTextDiv = plex.dom.ce('div', appDiv);
  shareTextDiv.className = 'vedShareText';
  shareTextDiv.innerHTML = plex.string.textToHtml(
      'This level is encoded in the URL below. ' +
      'You can email it, IM it, post it, bookmark it, whatever.\n' +
      'Anyone who opens it can to play it, copy and edit, and re-share it.', true);

  // The "level=" prefix must be included, to prevent the first "=" sign
  // in the data from being interpreted as a key/value separator.
  var url = [
    location.origin, location.pathname, '#',
    VedApp.Params.LEVEL, '=', VedApp.LevelPrefix.DATA, base64].join('');
  var a = plex.dom.ce('a', appDiv);
  a.className = 'selectable vedShareLink';
  a.href = url;
  a.innerHTML = plex.string.textToHtml(url);
};

VedApp.prototype.renderJsonMode = function(appDiv, levelAddress) {
  var div = plex.dom.ce('div', appDiv);
  div.style.clear = 'both';
  div.className = 'selectable';
  var json = this.getTemplatizedJsonForLevel(levelAddress);
  var text = JSON.stringify(json);
  text = plex.string.replace(text, '],', '],\n');
  div.innerHTML = plex.string.textToHtml(text, true);
};

VedApp.prototype.createLevel = function(name, opt_ops) {
  var ops = opt_ops || [];
  var opStor = new OpStor(this.stor, name);
  opStor.touch();
  for (var i = 0; i < ops.length; i++) {
    opStor.appendOp(ops[i]);
  }
};
