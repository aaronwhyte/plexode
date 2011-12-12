#!/usr/bin/env python

import format

def formatMinigames():
  name = 'minigames'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
<link rel="stylesheet" type="text/css" href="minigames.css">
</head><body>""")
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
<a href="./1/index.html">minigame 1</a></br>
"""))
  h.append(format.footer())
  return ''.join(h)


def formatMinigame1(jsName):
  name = 'minigames'
  h = []
  h.append(format.headStart(name, 2))
  h.append("""
<link rel="stylesheet" type="text/css" href="../minigame.css">
<script src="./""" + jsName + """"></script>
</head>
<body onload="main()">
<div id="levelCenter">
minigame 1 ?<br>
<canvas id="canvas" width=600 height=600></canvas>
</div>
</body>
</html>
""")
  return ''.join(h)


def main():
  print formatMinigames()

if __name__ == "__main__":
  main()
