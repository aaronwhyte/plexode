#!/usr/bin/env python

import format

def formatFracas():
  name = 'fracas'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
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

</head><body onload="onloadHandler()">""")
  h.append(format.navDiv(name))
  h.append(format.mainDiv("""
<div id="game">
<div align="center">
<div class="smalldoc" style="padding-bottom:4px">
Arrows move, space &amp arrows fire.  Defeat the gnomes!
</div>
<div id="fracas">fracas goes here</div>
</div>
</div>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatFracas()

if __name__ == "__main__":
  main()
