#!/usr/bin/env python

import format

def formatEval2():
  name = 'eval2'
  h = []
  h.append(format.headStart(name, 1))
  h.append(format.plexScripts())
  h.append("""
<script src="../js/eval2.js"></script>
<style>
#log {
  height:100em;
  background:#eee;
  font-family:monospace;
  font-size:smaller;
  display:none;
}

#ac, #peek {
  height:8em;
  overflow:auto;
}

#ac, #peek, #out {
  font-family:courier new, monospace;
}

#ac {
  background:#ddf;
}

#peek {
  background:#ffd;
  padding:0 0.5em;
}

#ac div.name {
  padding:0 0.5em; float:left;
}

#ac div.type {
  padding:0 0.5em;
  text-align:right;
}

#ac .plexWijMenuItemHilited {
  background:#44f;
  color:#ff8;
}

#taBorder {
  border:2px solid #44f;
  padding:0.25em;
}

#ta {
  width:100%;
  height:20em;
  border:0;
  padding:0;
  margin:0;
}
</style>
""")
  h.append('</head><body onload="plex.eval2.start()">')
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
<div id="log"></div>
A JavaScript evaluator - Now with autocomplete!<sub>BETA</sub><br>
[ctrl-up] and [ctrl-down] change the hilited item.<br>
[ctrl-right] and [ctrl-.] insert the hilited item and append a "."<br>
[ctrl-enter] inserts the hilited item only.<br>

<table cellspacing=0 cellpadding=0 border=0 
 style="width:100%; table-layout:fixed">
<tr><td style="width:50%">
<div id="ac"></div>
<td style="width:50%"><div id="peek"></div>
</table>

<div id="taBorder"><div>
<textarea id="ta" name="ta"></textarea>
</div></div>

<div style="margin:1em 0">
<button onclick="plex.eval2.evalOnce()">eval once</button>
N:<input id="ms" type="text" value="100" size="5">
<button onclick="plex.eval2.evalEveryN(gebi('ms').value)">eval every N ms</button>
</div>

<div id="out"></div>
<div id="d"></div>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatEval2()

if __name__ == "__main__":
  main()
