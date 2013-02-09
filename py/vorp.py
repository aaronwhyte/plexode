#!/usr/bin/env python

import format
import build


def formatVorp():
  name = 'vorp'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
<link rel="stylesheet" type="text/css" href="./vorp.css">
</head><body>""")
  h.append(format.navDiv(name, 1))
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
<a href="http://www.mozilla.org/firefox">Firefox</a>,
<a href="http://www.apple.com/safari/">Safari</a>, and
<a href="http://www.opera.com/browser">Opera</a>.
<br>
<a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home">IE 9</a> and up
might work, but I haven't tested it.

<h1>Controls</h1>
Use the arrow keys to move.
<p>
Push Z to grip things your tractor beam. Arrow keys aim.<br>
Push X to drop stuff.<br>
Hold Z down for a stiff grip.<br>
Push X while holding Z to throw.<br>
<small>(Dvorak nerds can use semicolon and Q.)</small>
<p>

<h1>Play it!</h1>
""" + formatLevelDirectory() + """
<p>
Each level is a web page, and the exits are links between web pages.<br>
To restart a level, hit "refresh" on your browser.  You can bookmark levels and send URLs to people,
just like you can with any other web page.
<p>
Vorp is still under construction, so check back here for updates.<br>
Or follow all Plexode changes on <a href="https://github.com/aaronwhyte/plexode">GitHub</a>!
</div>
"""))
  h.append(format.footer())
  return ''.join(h)


VORP_LEVELS = (
  ("lesson1", "Lesson 1: Moving Around",
    "Hi there! You can move with the arrow keys. (There's no touchscreen UI yet.)<br>Bump into the green exit thing to go to the next level."),
  ("lesson2", "Lesson 2: Pushing Things",
    "Run into the blocks and push them out of your way to reach the exit."),
  ("lesson3", "Lesson 3: Buttons and Stuff",
    "Bump buttons and cross beams to activate doors and things."),
  ("lesson4", "Lesson 4: Getting Killed Is Completely Normal",
    "Sometimes you've got to die on purpose to complete a level."),
  ("lesson5", "Lesson 5: You Have a Tractor Beam!",
    "Press Z to grab things. Reach farther by using arrow keys. Press X to let go."),
  ("lesson6", "Lesson 6: Grip Switches",
    "Put something (yourself, blocks, whatever) near a gripswitch to activate it."),
  ("lesson7", "Lesson 7: You Can Throw Things",
    "You can throw something you're holding:<br>" +
    "Hold down Z, and without letting go, tap X."),
  ("lesson8", "Lesson 8: Teleport Yourself",
    "This is a teleporter. Go ahead, touch it."),
  ("lesson9", "Lesson 9: Move Teleporters Around",
    "You can grab teleporters and move them around like blocks."),
  ("lesson10", "Lesson 10: Teleport Other Things",
    "You can teleport blocks. Sure, why not?"),

  ("level1", "level 1", "first level I ever made"),
  ("level2", "level 2 x_x", "zapper test"),
  ("level3", "level 3 :-0", "1st proper level"),
  ("level4", "level 4 :-/", "sensor and door test"),
  ("level5", "level 5 O_o", "grip-switch test"),
  ("level6", "level 6 :-D", "2nd proper level")
)


def formatLevelDirectory():
  h = []
  for level in VORP_LEVELS:
    relPath = level[0]
    title = level[1]
    desc = level[2]
    h.append('<a href="' + relPath + '">' + title + '</a><br>\n')
  return ''.join(h)


def writePublicHtmlForAllLevels(bdir, vorpPath, vorpJsName):
  for level in VORP_LEVELS:
    dir = vorpPath + level[0]
    title = level[1]
    desc = level[2]
    build.writePublicHtml(bdir, dir, formatVorpLevel(vorpJsName, title, desc))


def formatVorpLevel(jsName, title, description):
  return ''.join([
"""<!DOCTYPE HTML>
<html><head><title>""", title, """</title>
<link rel="stylesheet" type="text/css" href="../../css/plexode3.css">
<link rel="stylesheet" type="text/css" href="../vorp.css">
<script src="../""" + jsName + """"></script>
<script src="./level.js"></script>
<script>
function main() {
  // Convert ops JSON to GrafModel.
  var levelOps = plex.object.values(vorpLevels)[0];
  var grafModel = new GrafModel();
  grafModel.applyOps(levelOps);

  // create vorp instance
  var canvas = document.getElementById('canvas');
  var renderer = new Renderer(canvas, new Camera());
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(renderer, gameClock, sledgeInvalidator);

  // Use Transformer to populate Vorp with Model.
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(grafModel);

  // Start the game up!
  vorp.startLoop();
}
</script>
</head>
<body onload="main()">
<div id="levelCenter">

<div id="game">
<div id="levelHeader">
<a class="backToVorp" href="../">&laquo; vorp</a><div class="vorpLevelTitle">""" + title + """</div>
<div class="vorpLevelDesc">""" + description + """</div>
</div>
<canvas id="canvas" width=600 height=600></canvas>
</div>

<!--<div id="settings">
<div id="flags">flags</div>
</div>-->

</div>

<div id="levelFooter">
<div id="miniHelp">Arrows move, Z grabs, and X drops. Tap X while holding Z to throw.</div>
</div>

<div class="copyright">Copyright 2010 Aaron Whyte</div>

</body>
</html>
"""])


def main():
  print formatVorp()

if __name__ == "__main__":
  main()

