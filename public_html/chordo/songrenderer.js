/**
 * @constructor
 */
function SongRenderer() {
}

// global for debugging
SongRenderer.prototype.formatSong = function(song) {
  window['song'] = song;
  var h = [];
  var oldInMeasure = false;
  function measure(newInMeasure) {
    if (!oldInMeasure && newInMeasure) {
      h.push('<div class="measure">');
    } else if (oldInMeasure && !newInMeasure) {
      h.push('</div>');
    }
    oldInMeasure = newInMeasure;
  }
  for (var i = 0; i < song.layout.length; i++) {
    var e = song.layout[i];
    if (e == SongModel.MEASURE_BREAK) {
      measure(false);
      //h.push('<div class="measurebreak"></div>');
    } else if (e == SongModel.LINE_BREAK) {
      measure(false);
      h.push('<br>');
    } else if (e['fingering']) {
      measure(false);
      h.push('<div class="chorddef">',
          plex.string.textToHtml(e.tokens.join(' ')), ' ',
          this.formatFingering(e.fingering),
          '</div>');
    } else {
      measure(true);
      var f = song.getFingeringForPlayable(e);
      h.push('<div class="playable">',
          '<div class="playabletokens">',
          plex.string.textToHtml(e.tokens.join(' ')) || '&nbsp;',
          '</div>',
          this.formatFingering(f ? f.fingering: null),
          '<div class="lyrics">',
          plex.string.textToHtml(e.lyrics),
          '</div>',
          '</div>');
    }
  }
  measure(false);
  return h.join('');
};

SongRenderer.prototype.formatFingering = function(fingering) {
  if (!fingering) {
    return '<div class="fingering"><br><br><br><br><br><br></div>'
  }
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
  for (var i = rowsRendered; i < 6; i++) {
    h.push(sep, '------');
  }
  h.push('</div>');
  return h.join('');
};
