#!/usr/bin/env python

import format

# TODO: Move this whole thing to glorious photonpotato.com/vorp/edit/

def formatVed(vorpJsName, vedJsName):
  name = 'vorp/edit'
  h = []
  h.append(format.headStart(name, 2))
  h.append("""
<link rel="stylesheet" type="text/css" href="../../css/plexode3.css">
<link rel="stylesheet" type="text/css" href="../vorp.css">
<link rel="stylesheet" type="text/css" href="./ved.css">

<script src="../""" + vorpJsName + """"></script>
<script src="./""" + vedJsName + """"></script>

<script src="../level1/level.js"></script>
<script src="../level2/level.js"></script>
<script src="../level3/level.js"></script>
<script src="../level4/level.js"></script>
<script src="../level5/level.js"></script>
<script src="../level6/level.js"></script>

<script>
var vedApp;
function main() {
  var stor = new Stor(localStorage, 'ved');
  stor.listenToStorage();
  vedApp = new VedApp(document.getElementById('vedroot'), stor, vorpLevels);
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
