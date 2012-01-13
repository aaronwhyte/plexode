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
ved goes here
<script src=\"../vorp/""" + vorpJsName + """\"></script>
<script src=\"""" + vedJsName + """\"></script>
"""))
  h.append(format.footer())
  return ''.join(h)

if __name__ == "__main__":
  main()