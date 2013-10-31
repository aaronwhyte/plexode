#!/usr/bin/env python

import format
import os

def getFileNamesInPath(startPath):
  names = []
  for root, dirs, files in os.walk(startPath):
    for fname in files:
      names.append(os.path.join(root, fname))
  return names

def formatVed(vorpJsName):
  name = 'vorp'
  h = []
  h.append(format.headStart(name, 2))
  h.append("""
<link rel="stylesheet" type="text/css" href="../css/plexode3.css">
<link rel="stylesheet" type="text/css" href="edit/ved.css">
""")
  h.append('<script src="%s"></script>' % vorpJsName)
  h.append("""
<script>
var vedApp;
function main() {
  var stor = new Stor(localStorage, 'ved');
  stor.listenToStorage();
  vedApp = new VedApp(document.getElementById('vedroot'), stor);
  vedApp.render();
}
</script>

</head><body onload="main()">""")
  h.append(format.navDiv(name, 2))
  h.append(format.mainDiv("""<div id="vedroot">ved stuff goes here</div>"""))
  h.append(format.footer())
  return ''.join(h)

if __name__ == "__main__":
  main()
