#!/usr/bin/env python

import format

def formatUnsquish():
  name = 'unsquish'
  h = []
  h.append(format.headStart(name, 1))
  h.append("""
<script src="../js/plex/map.js"></script>
<script src="../js/plex/string.js"></script>
<script src="../js/plex/url.js"></script>
<script src="../js/plex/urlsquisher.js"></script>
<script src="../js/unsquish.js"></script>
</head>
<body onload="unsquish()">
<i>unsquish...</i>
</body>
</html>
""")
  return ''.join(h)

def main():
  print formatUnsquish()

if __name__ == "__main__":
  main()
