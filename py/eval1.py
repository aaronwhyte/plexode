#!/usr/bin/env python

import format

def formatEval():
  name = 'eval'
  h = []
  h.append(format.headStart(name, 1))
  h.append('</head><body>')
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
A JavaScript evaluator.&nbsp; <button onclick="toggleHelp()">help</button><br>
<div id="help" style="display:none">
Some util functions:""" +
    format.table(
    'id="tab" style="border-collapse:collapse; border-color:silver;" ' +
    'border=1 cellpadding=2', [
      ['<code>expose(object)</code>', 'shows object\'s key/value pairs'],
      ['<code>ce(nodeName, parentNode)</code>', 
       'createElement - parent optional'],
      ['<code>ct(text, parentNode)</code>',
       'create text node - parent optional'],
      ['<code>gebi(id)</code>', 'document.getElementById(id)']]) +
"""
The table above has an id='tab'.<br>
There's a div with id='d' at the bottom of the document.
</div>
<textarea rows="20" cols="60" id="ta" name="ta" style="width:100%">
</textarea>

<div style="margin:1em 0;">
<button onclick="once()">eval once</button>
<button onclick="everyN(1000)">eval every second</button>
N:<input id="ms" type="text" value="100" size="5">
<button onclick="everyN(getElementById('ms').value)">eval every N ms</button>
</div>

<pre id="out" style="font-size:1em"></pre>
<div id="d"></div>

<script>
var tickId = null;
var plexOut = gebi('out');
var plexTa = gebi('ta');
var plexD = gebi('d')
plexTa.focus();

function toggleHelp() {
  var help = gebi('help');
  help.style.display = help.style.display ? '' : 'none';
}

function once() {
  if (tickId != null) {
    clearInterval(tickId);
    tickId = null;
  }
  calc();
}

function everySec() {
  everyN(1000);
}

function everyN(n) {
  if (tickId != null) {
    clearInterval(tickId)
  }
  calc();
  tickId = setInterval(calc, n);
}

function calc() {
  var expr = gebi('ta').value;
  var out = gebi('out'); 
  try{
    out.innerHTML = textToHtml(eval(expr).toString());
  } catch (e) {
    out.innerHTML =
        '<div style="color:red">Error:</div>' + textToHtml(expose(e), '<br>');
  }
}

</script>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatEval()

if __name__ == "__main__":
  main()
