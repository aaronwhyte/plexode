#!/usr/bin/env python

import format

def formatEval3Quirks():
  name = 'eval3quirks'
  h = []
  h.append(format.headStartQuirks(name, 1))
  h.append("""
<script src="../js/plex/dom.js"></script>
<script src="../js/plex/event.js"></script>
<script src="../js/plex/func.js"></script>
<script src="../js/plex/object.js"></script>
<script src="../js/plex/pubsub.js"></script>
<script src="../js/plex/string.js"></script>
<script src="../js/plex/url.js"></script>
<script src="../js/plex/wij/tachanges.js"></script>

<script src="../js/eval3.js"></script>
<style>
#log {
  height:100em;
  background:#eee;
  font-family:monospace;
  font-size:smaller;
  display:none;
}

#taBorder {
  border:2px solid #44f;
  padding:0.25em;
}

.ta {
  width:100%;
  height:20em;
}

.nowrap {
  white-space:nowrap;
}

</style>
""")
  h.append('</head><body onload="plex.eval3.start()">')
  h.append('</head><body>')
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
<div id="log"></div>

<table style="width:100%" cellpadding=4>
<tr>
<td style="width:50%" valign="top">
<b>HTML</b> (quirks mode)<br>
<textarea class="ta" id="ht"></textarea>

<button onclick="plex.eval3.evalHtml()">set innerHTML now</button>&nbsp;
<span class="nowrap">When HTML changes:</span>
<span class="nowrap"><input type="checkbox" id="ohh" checked><label for="ohh">set innerHTML</label>
</span>
<span class="nowrap">
<input type="checkbox" id="ohj" checked><label for="ohj">eval JS</label>
</span>

</td>

<td style="width:50%" valign="top">
<b>JS</b><br>
<textarea class="ta" id="jt"></textarea>

<button onclick="plex_eval3_evalJs()">eval JS now</button>&nbsp;
<span class="nowrap">When JS changes:</span>
<span class="nowrap"><input type="checkbox" id="ojh" checked><label for="ojh">set innerHTML</label>
</span>
<span class="nowrap">
<input type="checkbox" id="ojj" checked><label for="ojj">eval JS</label>
</span>&nbsp;
<span class="nowrap">
<input type="checkbox" id="cex" checked><label for="cex">catch exceptions</label>
<span>

</td>
</tr>
</table>

<div style="text-align:center">
Every <input type="text" value="100" size="4" id="ms">ms
<span class="nowrap">
<input type="checkbox" id="oth"><label for="oth">set innerHTML</label>
</span>
<span class="nowrap">
<input type="checkbox" id="otj"><label for="otj">eval JS</label>
</span>
</div>

<hr>
<div id="hd"></div>
<hr>
<div id="jd"></div>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatEval3Quirks()

if __name__ == "__main__":
  main()

