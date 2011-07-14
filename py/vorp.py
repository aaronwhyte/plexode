#!/usr/bin/env python

import format

def formatVorp():
  name = 'vorp'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
<link rel="stylesheet" type="text/css" href="./vorp.css">
</head><body>""")
  h.append(format.navDiv(name))
  h.append(format.mainDiv("""
<div class=center>
<h1>About Vorp</h1>
Vorp is a free 2D physics-based action/puzzle game that runs in modern web browsers.
<p>
It's written in JavaScript, and it uses the
HTML5 &lt;canvas&gt; element to render all the graphics.
There are no sound effects yet.
<p>
It works well in <a href="http://www.google.com/chrome/">Chrome</a>, 
<a href="http://www.google.com/search?q=firefox+4">Firefox 4</a>, Safari, and
<a href="http://www.opera.com/">Opera</a>.
<br>
It's slow in Firefox 3, but it works.
<br>
<a href="http://www.google.com/search?q=internet+explorer+9">IE 9</a>
might work. IE 8 and lower don't have &lt;canvas&gt; support, so they won't work on their own,
but they might if you install the <a href="http://code.google.com/chrome/chromeframe/">Chrome Frame</a> plugin.

<h1>Controls</h1>
Use the arrow keys to move.
<p>
Press Z to pick things up with your tractor beam.<br>
Press X to drop or throw things.<br>
<small>(Dvorak nerds can use semicolon and Q.)</small>
<p>
After you pick something up, hold down the Z key for a stiff hold, or release it to drag or swing an object.<br>
Holding Z down charges the tractor beam; if you press X when the beam is charged,
you'll throw the object instead of dropping it.
<p>

<h1>Play it!</h1>
<a href="level1/index.html">level 1: test level with portals and lots of blocks to throw around</a><br>
<a href="level2/index.html">level 2: tiny test of a button and a player-blocking field</a><br>
<a href="level3/index.html">level 3: a proper level with real challenges and puzzles</a><br>
<a href="level4/index.html">level 4: small test for a beam-sensor and a door</a><br>
<a href="level5/index.html">level 5: tiny test of a grip-switch</a><br>
<a href="level6/index.html">level 6: the second proper level</a><br>
<p>
Each level is a web page, and the exits are links between web pages.<br>
To restart a level, hit "refresh" on your browser.  You can bookmark levels and send URLs to people,
just like you can with any other web page.
<p>
Vorp is still under construction, so check back here for updates.
</div>
"""))
  h.append(format.footer())
  return ''.join(h)


def formatVorpLevel(title, description):
  return ''.join([
"""<!DOCTYPE HTML>
<html><head><title>""", title, """</title>
<link rel="stylesheet" type="text/css" href="../vorp.css">

<script src="../../js/util.js"></script>
<script src="../../js/circularqueue.js"></script>
<script src="../../js/vec2d.js"></script>
<script src="../../js/gameutil.js"></script>
<script src="../../js/plex/cubicbezier.js"></script>
<script src="../../js/plex/event.js"></script>
<script src="../../js/plex/window.js"></script>
<script src="../../js/plex/point.js"></script>
<script src="../../js/plex/rect.js"></script>
<script src="../../js/skipqueue.js"></script>

<script src="../../js/gaam/cellcollider.js"></script>
<script src="../../js/gaam/cellentryevent.js"></script>
<script src="../../js/gaam/cellgroup.js"></script>
<script src="../../js/gaam/flags.js"></script>
<script src="../../js/gaam/hit.js"></script>
<script src="../../js/gaam/mark.js"></script>
<script src="../../js/gaam/paintevent.js"></script>
<script src="../../js/gaam/painter.js"></script>
<script src="../../js/gaam/rayscan.js"></script>
<script src="../../js/gaam/wham.js"></script>
<script src="../../js/gaam/phy.js"></script>
<script src="../../js/gaam/sprite.js"></script>
<script src="../../js/gaam/spritetimeout.js"></script>
<script src="../../js/gaam/sledge.js"></script>

<script src="../levelbuilder.js"></script>
<script src="../renderer.js"></script>
<script src="../vorp.js"></script>
<script src="../vorpwham.js"></script>

<script src="../prefab/beamsensorprefab.js"></script>
<script src="../prefab/blockprefab.js"></script>
<script src="../prefab/buttonprefab.js"></script>
<script src="../prefab/deadplayerprefab.js"></script>
<script src="../prefab/doorprefab.js"></script>
<script src="../prefab/exitprefab.js"></script>
<script src="../prefab/gripprefab.js"></script>
<script src="../prefab/prefab.js"></script>
<script src="../prefab/playerassemblerprefab.js"></script>
<script src="../prefab/playerprefab.js"></script>
<script src="../prefab/portalpairprefab.js"></script>
<script src="../prefab/timerprefab.js"></script>
<script src="../prefab/wallprefab.js"></script>
<script src="../prefab/zapperprefab.js"></script>

<script src="../sprites/beamersprite.js"></script>
<script src="../sprites/blocksprite.js"></script>
<script src="../sprites/buttonsprite.js"></script>
<script src="../sprites/deadplayersprite.js"></script>
<script src="../sprites/doorsprite.js"></script>
<script src="../sprites/exitsprite.js"></script>
<script src="../sprites/gripsprite.js"></script>
<script src="../sprites/playerassemblersprite.js"></script>
<script src="../sprites/playersprite.js"></script>
<script src="../sprites/portalsprite.js"></script>
<script src="../sprites/sensorsprite.js"></script>
<script src="../sprites/timersprite.js"></script>
<script src="../sprites/wallsprite.js"></script>
<script src="../sprites/zappersprite.js"></script>

<script src="../painters/sparklist.js"></script>

<script src="../painters/beamerpainter.js"></script>
<script src="../painters/buttonpainter.js"></script>
<script src="../painters/deadplayerpainter.js"></script>
<script src="../painters/grippainter.js"></script>
<script src="../painters/playerassemblerpainter.js"></script>
<script src="../painters/playerpainter.js"></script>
<script src="../painters/rectpainter.js"></script>
<script src="../painters/timerpainter.js"></script>
<script src="../painters/tractorbeampainter.js"></script>
<script src="../painters/tractorbeamsparklist.js"></script>
<script src="../painters/zapperpainter.js"></script>

<script src="./level.js"></script>
</head>
<body onload="main()">
<div id="levelCenter">

<div id="game">
""", description, """<br>
<canvas id="canvas" width=600 height=600></canvas>
</div>

<div id="settings">
<div id="flags">flags</div>
</div>

</div>
</body>
</html>
"""])


def main():
  print formatVorp()

if __name__ == "__main__":
  main()

