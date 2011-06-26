#!/usr/bin/env python

import format

name = 'insta-html'
print format.headStart(name)
print '</head><body onload="onLoadHandler()">'
print format.navDiv(name)
print format.mainDiv("""
Type HTML in the textarea, and it will be instantly rendered below.
<textarea onkeyup="changeHtml()" rows="20" style="width:100%" id="ta">
</textarea>

<div id="div"></div>

<script>
var ta;
var div;
function onLoadHandler() {
  ta = document.getElementById("ta");
  ta.focus();
  div = document.getElementById("div");
  changeHtml();
}

function changeHtml() {
  div.innerHTML = '<br>' + ta.value;
}
</script>
""")
print format.footer()
