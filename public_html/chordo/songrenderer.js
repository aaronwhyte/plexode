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
      h.push('<div class="measurebreak"></div>');
    } else if (e == SongModel.LINE_BREAK) {
      h.push('<br>');
    } else if (e['fingering']) {
      h.push('<div class="chorddef">',
          plex.string.textToHtml(e.tokens.join(' ')), ' ',
          this.formatFingering(e.fingering),
          '</div>');
    } else {
      var f = song.getFingeringForPlayable(e);
      h.push('<div class="playable">',
          '<span class="playabletokens">',
          plex.string.textToHtml(e.tokens.join(' ')),
          '</span>',
          f ? this.formatFingering(f.fingering) : '',
          '<div class="lyrics">',
          plex.string.textToHtml(e.lyrics),
          '</div>',
          '</div>');
    }
  }
  return h.join('');
};

SongRenderer.prototype.formatFingering = function(fingering) {
  var rowsRendered = 0;
  var h = ['<div class="fingering">'];
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
  var sep = '';
  if (hasXoRow) {
    h.push(chars.join(''));
    sep = '<br>';
    rowsRendered++;
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
      rowsRendered++;
      h.push(sep, chars.join(''));
      sep = '<br>';
    }
  }
  for (var i = rowsRendered; i < 4; i++) {
    h.push(sep, '------');
  }
  h.push('</div>');
  return h.join('');
};
