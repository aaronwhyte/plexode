/**
 * @constructor
 */
function SongRenderer() {
}

SongRenderer.prototype.formatSong = function(song) {
  var h = [];
  for (var i = 0; i < song.layout.length; i++) {
    var e = song.layout[i];
    if (e == SongModel.MEASURE_BREAK) {
      h.push(' | ');
    } else if (e == SongModel.LINE_BREAK) {
      h.push('<br>');
    } else if (e['fingering']) {
      h.push('<div style="display:inline-block; margin:1em">',
          plex.string.textToHtml(e.tokens.join(' ')), ': ',
          this.formatFingering(e.fingering),
          '</div>');
    } else {
      var f = song.getFingeringForPlayable(e);
      h.push('<div style="display:inline-block; margin:1em">',
          plex.string.textToHtml(e.tokens.join(' ')),
          '<br>',
          plex.string.textToHtml(e.lyrics),
          '<br>',
          f ? this.formatFingering(f.fingering) : '',
          '</div>');
    }
  }
  return h.join('');
};

SongRenderer.prototype.formatFingering = function(fingering) {
  var h = ['<div style="white-space: pre; font-family: monospace">'];
  var chars = [];
  var hasXoRow = false;
  for (var i = 0; i < 6; i++) {
    if (fingering[i][0] == 'x' || fingering[i][0] == 'o') {
      chars[i] = fingering[i];
      hasXoRow = true;
    } else {
      chars[i] = ' ';
    }
  }
  if (hasXoRow) {
    h.push(chars.join(''), '<br>');
  }
  var empty = false;
  for (var rowIndex = 0; !empty; rowIndex++) {
    empty = true;
    for (var i = 0; i < 6; i++) {
      if (rowIndex < fingering[i].length) {
        empty = false;
        var fingeringChar = fingering[i][rowIndex];
        if (fingeringChar == '/') {
          chars[i] = '-';
        } else if (/\d/.test(fingeringChar)) {
          chars[i] = fingering[i][rowIndex];
        } else {
          chars[i] = '-';
        }
      } else {
        chars[i] = '-';
      }
    }
    if (!empty) {
      h.push(chars.join(''), '<br>');
    }
  }
  h.push('</div>');
  return h.join('');
};
