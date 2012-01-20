#!/usr/bin/env python

import format

def formatVed(vorpJsName, vedJsName):
  name = 'ved'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
<link rel="stylesheet" type="text/css" href="./ved.css">
</head><body>""")
  h.append(format.navDiv(name, 1))
  h.append(format.mainDiv("""
<div
id="jsonTab" class="tab selected" onclick="selectTab('jsonTab')">json</div><div
id="editorTab" class="tab unselected" onclick="selectTab('editorTab')">editor</div><div
id="vorpTab" class="tab unselected" onclick="selectTab('vorpTab')">vorp</div>
<div style="background:#aaf;padding:1em;"> stuff goes here</div>
<script src=\"../vorp/""" + vorpJsName + """\"></script>
<script src=\"""" + vedJsName + """\"></script>
<script>
function selectTab(name) {
  var tabNames = ['jsonTab', 'editorTab', 'vorpTab'];
  for (var i = 0; i < tabNames.length; i++) {
    var tab = document.getElementById(tabNames[i]);
    if (tab.id == name) {
      tab.className = "tab selected";
    } else {
      tab.className = "tab unselected";
    }
  }
}
</script>
"""))
  h.append(format.footer())
  return ''.join(h)

if __name__ == "__main__":
  main()