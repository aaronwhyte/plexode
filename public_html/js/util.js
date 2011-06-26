Math.sgn = function(n) {
  if (n < 0) return -1;
  if (n > 0) return 1;
  return 0;
};

function expose(obj) {
  var text='';
  for (var x in obj) {
    text += x + ' = ';
    try {
      text+=obj[x];
    } catch (e) {
      text += '*** ' + e + ' ***';
    }
    text += '\n';
  }
  return text;
}

function textToHtml(text) {
  var html = '';
  var subs = [
    ['<', '&lt;'],
    ['&', '&amp;'],
    ['"', '&quot;'],
    ['\n', '<br />']
  ];
  for (var i=0; i<text.length; i++) {
    var c = text.charAt(i);
    var found = false;
    for (var j=0; j<subs.length && !found; j++) {
      if (subs[j][0] == c) {
        html += subs[j][1];
        found = true;
      }
    }
    if (!found) html += c;
  }
  return html;
}

function gebi(id) {
  return document.getElementById(id);
}

function ce(name, parent) {
  var e = document.createElement(name);
  if (parent) {
    parent.appendChild(e);
  }
  return e;
}

function ct(text, parent) {
  var e = document.createTextNode(text);
  if (parent) {
    parent.appendChild(e);
  }
  return e;
}
