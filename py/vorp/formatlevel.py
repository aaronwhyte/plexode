def formatPage(title, description):
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