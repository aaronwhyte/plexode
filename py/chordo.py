#!/usr/bin/env python

import format

def formatChordo():
  name = 'chordo'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
<link rel="stylesheet" type="text/css" href="./chordo.css">
<script src="../js/plex/dom.js"></script>
<script src="../js/plex/event.js"></script>
<script src="../js/plex/func.js"></script>
<script src="../js/plex/object.js"></script>
<script src="../js/plex/pubsub.js"></script>
<script src="../js/plex/string.js"></script>
<script src="../js/plex/url.js"></script>
<script src="../js/plex/wij/tachanges.js"></script>

<script src="../chordo/chordo.js"></script>
<script src="../chordo/songmodel.js"></script>
<script src="../chordo/songparser.js"></script>
<script src="../chordo/songrenderer.js"></script>
<script>
// Global, for debugging.
var chordo;
function onLoadHandler() {
  chordo = new Chordo(
      new SongParser(),
      new SongRenderer(),
      'ta',
      'output',
      'jazzChords');
  chordo.start();
  chordo.redraw();
}
</script>
</head><body onload="onLoadHandler()">
""")
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
<div>
<input type="checkbox" id="jazzChords">
<label for="jazzChords">include jazz chords</label>
</div>
<textarea id="ta">
Em: o /2 /3 o o o
E: o /2 /3 1 o o
C: x //3 /2 o 1 o
maj bar: 1 1/3 1/4 12 1 1

C: Hello!
E: This is major
-
Em: This is minor.
F maj bar: Bar chord
</textarea>
<div id="output"></div>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatChordo()

if __name__ == "__main__":
  main()
