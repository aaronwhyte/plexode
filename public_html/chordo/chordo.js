function Chordo(parser, renderer, inputId, outputId) {
  this.parser = parser;
  this.renderer = renderer;
  this.inputId = inputId;
  this.outputId = outputId;
}

Chordo.prototype.start = function() {
  // Decode URL and fill whitelisted input fields with initial values.
  var map = plex.url.decodeQuery(plex.url.getFragment());
  var ids = [this.inputId];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    if (id in map) {
      var input = plex.dom.gebi(id);
      if (input.type == 'checkbox') {
        input.checked = map[id] == '1';
      } else {
        plex.dom.gebi(id).value = map[id];
      }
    }
  }

  function taListen(id, handler) {
    var c = new plex.wij.TaChanges();
    c.setElement(plex.dom.gebi(id));
    c.subChange(handler);
  }
  taListen(this.inputId, plex.func.bind(this.updateSong, this));

  this.inputEl = plex.dom.gebi(this.inputId);
  this.outputEl = plex.dom.gebi(this.outputId);
};

Chordo.prototype.updateSong = function() {
  this.redraw();
  this.save();
};

Chordo.prototype.redraw = function() {
  var song = this.parser.parse(this.inputEl.value);
  this.outputEl.innerHTML = this.renderer.formatSong(song);
};

Chordo.prototype.save = function() {
  var map = {};
  var ids = [this.inputId];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var input = plex.dom.gebi(id);
    if (input.type == 'checkbox') {
      map[id] = input.checked ? 1 : 0;
    } else {
      map[id] = plex.dom.gebi(id).value;
    }
  }
  var q = plex.url.encodeQuery(map);
  plex.url.setFragment(q);
};
