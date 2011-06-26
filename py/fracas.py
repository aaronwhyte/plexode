#!/usr/bin/env python

import format

name = 'fracas'
print format.headStart(name)

print """
<link rel="stylesheet" type="text/css" href="/fracas/fracas.css">
<script src="/js/vec2d.js"></script>
<script src="/fracas/FracRend.js"></script>
<script src="/fracas/Fracas.js"></script>
<script src="/fracas/levels/level0.js"></script>
<script src="/fracas/levels/level1.js"></script>
<script src="/fracas/levels/level2.js"></script>
<script src="/fracas/levels/level3.js"></script>
<script src="/fracas/levels/level4.js"></script>
<script src="/fracas/levels/level5.js"></script>
<script>
function onloadHandler() {
  var frac = new Fracas('fracas');
  frac.startGame();
}
</script>

</head><body onload="onloadHandler()">"""

print format.navDiv(name)

print format.mainDiv("""
<div id="game">
<div align="center">
<div class="smalldoc" style="padding-bottom:4px">
Arrows move, space &amp arrows fire.  Defeat the gnomes!
</div>
<div id="fracas">fracas goes here</div>
</div>
</div>
""")

print format.footer()
