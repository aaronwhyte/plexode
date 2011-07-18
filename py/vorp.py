#!/usr/bin/env python

import format

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
<script src="../vorp-compiled.js"></script>
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

