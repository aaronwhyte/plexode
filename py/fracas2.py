#!/usr/bin/env python

import format

name = 'fracas2'
print format.headStart(name, 1)

print """
<script src="../js/util.js"></script>
<script src="../js/vec2d.js"></script>
<script src="../js/gameutil.js"></script>
<script src="../js/plex/array.js"></script>
<script src="../js/plex/event.js"></script>
<script src="../js/plex/window.js"></script>
<script src="../js/plex/point.js"></script>
<script src="../js/plex/rect.js"></script>

<script src="./sprite.js"></script>
<script src="./spritetimeout.js"></script>
<script src="./sledge.js"></script>

<script src="./sprites/bouldersprite.js"></script>
<script src="./sprites/bulletsprite.js"></script>
<script src="./sprites/followersprite.js"></script>
<script src="./sprites/playersprite.js"></script>
<script src="./sprites/sensorsprite.js"></script>
<script src="./sprites/wallsprite.js"></script>

<script src="./cellcollider.js"></script>
<script src="./cellentryevent.js"></script>
<script src="./cellgroup.js"></script>
<script src="./hit.js"></script>
<script src="./mark.js"></script>
<script src="./rayScan.js"></script>

<script src="./skipqueue.js"></script>

<script src="./wham.js"></script>
<script src="./phy.js"></script>
<script src="./renderer.js"></script>
<script src="./fracas2.js"></script>

<script src="./main.js"></script>

</head>
<body onload="main()">
"""
print format.navDiv(name)
print format.mainDiv("""
Fracas 2 is under construction.  Use I, J, K, and L to move.  Space + move = fire.<br>

<canvas id="canvas" width=800 height=600" style="background:black">
Looks like this web browser doesn't support the HTML 5 canvas element. :-(<br>
You should get one that does, like Safari 4+, Chrome, Firefox 3+, IE 9+, probably Opera...
</canvas>

</body></html>
<canvas id="canvas" width=800 height=600">
Looks like this web browser doesn't support the HTML 5 canvas element. :-(<br>
You should get one that does, like Safari 4+, Chrome, Firefox 3+, IE 9+, probably Opera...
</canvas>
""")
print format.footer()
