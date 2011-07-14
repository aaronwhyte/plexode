#!/usr/bin/env python

import format

def formatInstaHtml():
  name = 'insta-html'
  h = []
  h.append(format.headStart(name, 1))
  h.append('</head><body onload="onLoadHandler()">')
  h.append(format.navDiv(name))
  h.append(format.mainDiv("""
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
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatInstaHtml()

if __name__ == "__main__":
  main()
