/**
 * Top level class for the Vorp EDitor.
 * @constructor
 */
function VedApp(rootNode, stor, opt_testLevelMap) {
  this.rootNode = rootNode;
  this.stor = stor;
  this.testLevelMap = opt_testLevelMap || {};
}

VedApp.prototype.render = function() {

  // out-of-dom fragment to prevent rerendering as we go
  // (no idea if that really works)
  var appDiv = plex.dom.ce("div");

  // nuke button
  var nukeButton = plex.dom.ce("button", appDiv);
  plex.dom.ct("Nuke and repopulate", nukeButton);
  var self = this;
  nukeButton.onclick = function() {
    self.nuke();
    self.repopulate(); // vorpLevels is populated by levels
    self.render();
  };

  plex.dom.ce("hr", appDiv);

  // list of levels
  var levelNames = this.stor.getNames();
  for (var i = 0; i < levelNames.length; i++) {
    var levelDiv = plex.dom.ce("div", appDiv);
    plex.dom.ct(levelNames[i], levelDiv);
  }

  // put it all in the DOM
  this.rootNode.innerHTML = "";
  this.rootNode.appendChild(appDiv);
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

