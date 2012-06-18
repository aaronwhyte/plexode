this.plex = this.plex || {};

plex.eval2 = {};

plex.eval2.tickId = null;
plex.eval2.acMenu = null;

plex.eval2.logger = new plex.wij.Log(20);

function log(text, opt_color) {
  plex.eval2.logger.log(text, opt_color);
}

plex.eval2.start = function() {
  plex.dom.gebi('log').appendChild(plex.eval2.logger.getDiv());
  var ta = plex.dom.gebi('ta');
  
  // initialize the JS to be the hash value
  plex.eval2.updateTa(ta);
  
  ta.focus();
  
  // autocomplete setup
  var acMenu = new plex.wij.Menu();
  acMenu.formatItemFunc = plex.eval2.formatAcItem;
  acMenu.subHilite(plex.eval2.acHiliteListener);

  plex.dom.gebi('ac').appendChild(acMenu.getDiv());
  
  var acInput = new plex.wij.AcInput();
  acInput.setElement(ta);
  
  var jsac = new plex.wij.JsAc();
  jsac.setAcInput(acInput);
  jsac.setMenu(acMenu);
  
  plex.eval2.acMenu = acMenu;
  
  var tac = new plex.wij.TaChanges();
  tac.setElement(ta);
  tac.subChange(plex.eval2.updateFragment);
};

plex.eval2.formatAcItem = function(item) {
  var nameHtml = plex.string.textToHtml(item.name);
  var type = plex.type.getType(item.value);
  if (type == 'object') {
    try {
      var ctr = String(item.value.constructor);
      if (ctr && ctr.charAt(0) == '[') {
        type += ' ' + ctr;
      }
    } catch (e) {
      // ignore access exception
    }
  }
  var typeHtml = plex.string.textToHtml(type);

  return [
    '<div class="name">', nameHtml, '</div>',
    '<div class="type">', typeHtml, '</div>'
  ].join('');
};

plex.eval2.acHiliteListener = function(index) {
  if (index < 0) {
    plex.dom.gebi('peek').innerHTML = '';
  } else {
    try {
      var value = plex.eval2.acMenu.items[index].value;
      var text = '';
      if (typeof value == 'object') {
        var ctr = String(value.constructor);
        if (ctr && ctr.indexOf('JavaPackage') == -1) {
          text = plex.object.keys(value).join('\n');
        }
      } else {
        text = String(value);
      }
    } catch (e) {
      // ignored.  Some objects just don't want to be looked at.
    }
    plex.dom.gebi('peek').innerHTML = plex.string.textToHtml(text, true);
    plex.dom.scrollIntoView(plex.eval2.acMenu.getNodeByIndex(index),
                            plex.dom.gebi('ac'));
  }
};

plex.eval2.updateFragment = function(val) {
  // Just setting the location.hash to the val fails to encode newlines in
  // Safari, so we replace the whole URL with a manually generated string.
  // Also, setting the hash to empty-string removes the '#', causing a reload,
  // so always add the #.
  // TODO(awhyte): refactor to plex.url
  var href = [
    location.protocol,
    '//',
    location.hostname,
    location.port ? ':' + location.port : '',
    location.pathname,
    location.search,
    '#',
    val ? encodeURIComponent(val) : ''];
  location.replace(href.join(''));
  if (invalidateSquishedUrl) invalidateSquishedUrl();
};

plex.eval2.updateTa = function(ta) {
  if (location.hash) {
    // location.hash includes the '#', so skip that, and decode.
    ta.value = decodeURIComponent(location.hash.substring(1));
  }
};

plex.eval2.evalOnce = function() {
  if (plex.eval2.tickId != null) {
    clearInterval(plex.eval2.tickId);
    plex.eval2.tickId = null;
  }
  plex.eval2.calc();
};

plex.eval2.evalEveryN = function(n) {
  if (plex.eval2.tickId != null) {
    clearInterval(plex.eval2.tickId);
  }
  plex.eval2.calc();
  plex.eval2.tickId = setInterval(plex.eval2.calc, n);
};

plex.eval2.calc = function() {
  var expr = plex.dom.gebi('ta').value;
  var out = plex.dom.gebi('out'); 
  try{
    out.innerHTML = textToHtml(eval(expr).toString(), true);
  } catch (e) {
    out.innerHTML =
        '<div style="color:red">Error:</div>' +
        plex.string.textToHtml(plex.object.expose(e), '<br>');
  }
};
