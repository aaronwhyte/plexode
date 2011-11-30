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
  taListen(this.inputId, plex.func.bind(this.redraw, this));

  this.inputEl = plex.dom.gebi(this.inputId);
  this.outputEl = plex.dom.gebi(this.outputId);
};

Chordo.prototype.redraw = function() {
  var song = this.parser.parse(this.inputEl.value);
  this.outputEl.innerHTML = this.renderer.formatSong(song);
};