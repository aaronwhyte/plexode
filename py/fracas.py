#!/usr/bin/env python

import format

name = 'fracas'
print format.headStart(name, 1)

print """
<link rel="stylesheet" type="text/css" href="./fracas.css">
<script src="../js/vec2d.js"></script>
<script src="./FracRend.js"></script>
<script src="./Fracas.js"></script>
<script src="./levels/level0.js"></script>
<script src="./levels/level1.js"></script>
<script src="./levels/level2.js"></script>
<script src="./levels/level3.js"></script>
<script src="./levels/level4.js"></script>
<script src="./levels/level5.js"></script>
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
