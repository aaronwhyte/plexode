def printRedirectTo(absPath):
    print ''.join(["""Content-type: text/html

<!DOCTYPE HTML>
<html><head><title>plexode:redirector</title>
<script>
var ABS_PATH = '""", absPath, """';

function getFragment() {
  var hashIndex = window.location.href.indexOf("#");
  if (hashIndex == -1) return '';
  return window.location.href.substr(hashIndex + 1);
}

function getNewLocation() {
  var fragment = getFragment();
  return ABS_PATH + location.search + (fragment ? '#' + fragment : '');
}

function redirect() {
  location.replace(getNewLocation());
}
</script>
</head><body onload="redirect()">
Redirecting to """, absPath, """ in a way that should preserve your hash fragment in IE.
</body></html>"""])
