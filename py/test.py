#!/usr/bin/env python

import cgi
import format
import os.path

def formatTest(outputPath, scriptPaths):
  """Builds an HTML file to unit test JS.
  outputPath is the HTML file's path relative to the plexode dir.
  title is the HTML doc's title
  scriptPaths are all the JS dep paths, also relative to the plexode dir"""
  h = []
  h.append("""<!DOCTYPE html>
<head>
<title>""" + cgi.escape(outputPath) + """</title>
""")
  for scriptPath in scriptPaths:
    relScriptPath = os.path.relpath(scriptPath, outputPath)
    h.append('<script src="' + relScriptPath + '"></script>\n')
  h.append("""</head>
<body onload="runTests()">
</body>
</html>""")
  return ''.join(h)

if __name__ == "__main__":
  main()
