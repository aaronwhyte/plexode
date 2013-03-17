this.plex = this.plex || {};

function unsquish2() {
  var f = plex.url.getFragment();
  var staticDictionaryCode = f.charAt(0);
  var base64 = f.substr(1);
  var words;
  if (staticDictionaryCode == '3') {
    words = getEval3DWords();
  } else {
    words = [];
  }
  var s = new plex.Squisher(words);
  var u = s.unsquish(base64);
  window.location.replace(u);
}

function getEval3DWords() {
  return [
    'http://plexode.com/eval3', 'http://', 'plexode.com', 'eval3',
    'function', 'var ', 'new ', 'null', 'Date()', '.getTime()', 'this', 'return', 'innerHTML',
    'Math.', 'random()',
    '.join(', '.split(', '.push(',
    'getElementById', 'window', 'document', 'body', 'div', 'span', 'canvas', 'input', 'title',
    'class', 'style',
    'display', 'align', 'visibility', 'overflow', 'hidden',
    'position', 'absolute', 'relative',
    'top', 'left', 'right', 'bottom',
    'border', 'padding', 'margin', 'solid', 'color', 'width', 'height', 'font', 'size', 'background',
    '#ht=', '&jt=', '&ms=', '&cex=0', '&otj=1',
    'http%3A%2F%2F'
  ];
}
