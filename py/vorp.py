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
Vorp is still under construction, so check back here for updates.<br>
Or follow all Plexode changes on <a href="https://github.com/aaronwhyte/plexode">GitHub</a>!
</div>
"""))
  h.append(format.footer())
  return ''.join(h)


def formatVorpLevel(jsName, title, description):
  return ''.join([
"""<!DOCTYPE HTML>
<html><head><title>""", title, """</title>
<link rel="stylesheet" type="text/css" href="../vorp.css">
<script src="../""" + jsName + """"></script>
<script src="./level.js"></script>
</head>
<body onload="main()">
<div id="levelCenter">

<div id="game">
<div class="levelheader"><a href="../">plexode:vorp</a> - """, description, """</div>
<canvas id="canvas" width=600 height=600></canvas>
<div class="minihelp">arrows move, Z grabs, and X drops. tap X while holding Z to throw.</div>
</div>

<div id="settings">
<div id="flags">flags</div>
</div>

</div>

<div class="copyright">Copyright 2010 Aaron Whyte</div>
</body>
</html>
"""])


def main():
  print formatVorp()

if __name__ == "__main__":
  main()

