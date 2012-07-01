function Chordo(parser, renderer, inputId, outputId, jazzCheckboxId) {
  this.parser = parser;
  this.renderer = renderer;
  this.inputId = inputId;
  this.outputId = outputId;
  this.jazzCheckboxId = jazzCheckboxId;
}

Chordo.prototype.getStateIds = function() {
  return [this.inputId, this.jazzCheckboxId];
};

Chordo.prototype.start = function() {
  // Decode URL and fill whitelisted input fields with initial values.
  var map = plex.url.decodeQuery(plex.url.getFragment());
  var ids = this.getStateIds();
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
  function cbListen(id, handler) {
    plex.event.addListener(plex.dom.gebi(id), 'change',
        handler);
  }
  var changeFn = plex.func.bind(this.updateSong, this);
  taListen(this.inputId, changeFn);
  cbListen(this.jazzCheckboxId, changeFn);

  this.jazzEl = plex.dom.gebi(this.jazzCheckboxId);
  this.inputEl = plex.dom.gebi(this.inputId);
  this.outputEl = plex.dom.gebi(this.outputId);
};

Chordo.prototype.updateSong = function() {
  this.redraw();
  this.save();
};

Chordo.prototype.redraw = function() {
  var jazzy = this.jazzEl.checked;
  var song = this.parser.parse(
      (jazzy ? Chordo.JAZZ_CHORDS : '') +
      this.inputEl.value);
  this.outputEl.innerHTML = this.renderer.formatSong(song);
};

Chordo.prototype.save = function() {
  var map = {};
  var ids = this.getStateIds();
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
  if (invalidateSquishedUrl) invalidateSquishedUrl();
};

Chordo.JAZZ_CHORDS = [
  'maj form6: /1 /1/4 /1/3 /12 /1 /1',
  'maj form5: x /1 /1/3 /1/3 /1/3 /1',
  'maj7 form6: /1 x //3 //4 /2 x',
  'maj7 form5: x /1 /1/3 /12 /1/4 /1',
  'dom7 form6: /1 x /2 //4 /3 x',
  'dom7 form5: x /1 /1/3 /1 /1/4 /1',
  'maj6 form6: /2 x 1 //4 /3 x',
  'maj6 form5: x /2 ///3 1 ///4 x',
  'min form6: /1 /1/4 /1/3 /1 /1 /1',
  'min form5: x /1 /1/4 /1/3 /12 /1',
  'min7 form6: /2 x /3 /3 /3 x',
  'min7 form5: x /1 x /2 //4 /3',
  'min6 form6: /2 x 1 /3 /4 x',
  'min6 form5: x /2 x 1 //4 /3',
  'half-dim7 form6: /2 x /3 /4 1 x',
  'half-dim7 form5: x /1 //3 /2 //4 x',
  'dim7 form6: /3 x 1 /4 2 x',
  'dim7 form5: x /2 //3 1 //4 x',
  'dom7(b5) form6: /2 x /3 //4 1 x',
  'dom7(13) form6: /1 x /2 //3 ///4 x',
  'dom7(13) form5: x /1 x /1 /1/3 /1/3',
  'dom7(#5) form6: /1 x /2 //3 //4 x',
  'dom7(9) form6: /2 x /3 1 /4 x',
  'dom7(9) form5: x /2 1 /3 /3 /3',
  'dom7(#9) form5: x /2 1 /3 //4 x',
  'dom7(b9) form6: ///3 x ///4 /2 1 x',
  'dom7(b9) form5: x /2 1 13 1 x\n'].join('\n');
