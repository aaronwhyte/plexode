#!/usr/bin/env python

import format

def formatChordo():
  name = 'chordo'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
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
function onLoadHandler() {
  console.log('onload');
  var c = new Chordo(
      new SongParser(),
      new SongRenderer(),
      'ta',
      'output');
  c.start();
}
</script>
<style>

#ta {
  width:100%;
  height:20em;
}

#output {
  background:#ddd;
  padding:1em;
}

.nowrap {
  white-space:nowrap;
}

</style>
</head><body onload="onLoadHandler()">
""")
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
<textarea id="ta">
C open: x //3 /2 o 1 o
-
C: hi there
</textarea>
<div id="output"></div>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatChordo()

if __name__ == "__main__":
  main()
