#!/usr/bin/env python

import format

def formatMain():
  name = 'main'
  h = []
  h.append(format.headStart(name, 0))
  h.append("""
<style>
.news {
  display:block;
  max-width:50em;
  margin:1.5em 0;
}
.date {
  display:block;
  font-weight:bold;
}
a {
  white-space:nowrap;
}
</style>
""")
  h.append('</head><body>')
  h.append(format.navDiv(name, 0))
  h.append(format.mainDiv("""

<div class="news">
<span class="date">2014-03-17</span>
Added a <a href="https://plus.google.com/111062934711090819978" rel="publisher">Google+ page for plexode</a>.
</div>

<div class="news">
<span class="date">2013-10-26</span>
Now the Vorp editor is integrated into the game, and there's sharing by URL.
</div>

<div class="news">
<span class="date">2013-06-02</span>
<a href="/vorp">Vorp</a> has three new levels, with zombies and turrets!
</div>

<div class="news">
<span class="date">2013-03-18</span>
Now <a href="/eval3">eval3<a> is using a new URL compressor,
<a href="https://github.com/aaronwhyte/plexode/blob/master/public_html/js/plex/squisher.js">plex.squisher</a>,
that is always on.
All old URLs should still work. But the new ones should survive linkification better,
because they only use URL-friendly base64 characters. So they're more likely to work if you paste them into Gmail,
or forum markdown.
<p>
Here's a sample URL that animates wiggly tree tentacles on a canvas:
<a href="/eval3/#s=aekVQXANJVQMbAx10AUpFHpaCHhcVEQGDHhUZoHgePQOLG1RKTVdGU6kfHRB0HwMNA0uRk3APdh4IRFVJVk3GCBw9T2FPAR4BCWJkCmXLzU5QU0YjRk9F0AERDxEREgELAWmtTwlPEBIU5hEK2GF/I1NCT0RJcTkdDqBLsJTueAUCwUCQKAIOcYPC0NgcFg4QCYSjMNh7kiUOiASe6AfT8f0AB8CaUVd4QCgZjUfjsTlTtlgTc0MmMRjcge4uEQ5IAlEwxGopcQVCj3Gg1EQzGoqF4oIA0FQ7Ezieb3qIkIAnGAzFjiCQQCr3FAzGA4k4aszMZhhSzRX5uBIIOgIe1wIjiOgPJBGKokKBPKpGLJVuwTIt5bDMMABIr7LA1bhGBKKBoBI7bJhPIxUKmaIbfIuaIpGKLFhpcZgBAJEB5HVxNGZGYgJByKBbkC+a3W8B4UzW7CQPCfE4IXvTPS5HaWo1T/D7Rn9BodFFMNM+O5pK54JzhTz2gKgBDoBnOt5uv2JUISwBPM1/tB5VfZPKhNIWGBIRb8ikXfN9GxFMUBVfxl2kOCA31fc/H6gl/oAgI2H0ZFk2VEZlyKOkAVoWoAWaeJ5GhAEDABVxXlgCxo2licATaNw3jgadqTFAxDIWgQDzcFQVTbZeAxeAERhNFQRgBeuF3ufCQo7g5+IRf1/0OgEE4NbCPYHhKCzhig5JYlCWoPfl+5UhSYmufRkhCZRlmYh6IA4ZqVZeR8+X4SaNnSjmWYFaCQDcfJ3ZMA973xn99pSmdl5VbqFZrfWBoIf2d0cceipllOjpplmbZvhucTqnOdYuOCMEjnoSZ8jiOqSlqPqCk+axeMytj9A8RBNEYQhTbZuJVlVfiCZpfiDcyTaJNhsabo0CbERedbJlulWXGkMQqcyoIaZdTFOVBUlUVYJqmjGQY0OG07Mj2gZBoQzAIMouQDFASxJJIAwRvQThUvlN70gcS75BIAxeAAA=">
cthulhu</a>.
<p>
The new compressor turns the form fields into a JSON string,
percent-encodes all but the most vanilla characters,
does static-dictionary substitution to make some common strings shorter (like "document" and "function"),
then uses Lempel-Ziv to compress repeated strings,
and finally encodes everything in linkifier-friendly base64.
<p>
Aaaand in <a href="/vorp">Vorp</a>, it should be easier to make small movements with the little pink square that is you -
better for lining up throws, or getting onto a beam sensor. And <a href="/vorp/level2">level 2</a> got a little overhaul.
</div>

<div class="news">
<span class="date">2013-02-13</span>
I've been working on <a href="./vorp">Vorp</a>!<br>
Now there are ten lesson levels, and a couple new challenging levels.
</div>

<div class="news">
<span class="date">2012-06-19</span>
<i>[OBSOLETE]</i> URL compression! Plexode pages that store state in the URL, like <a href="/eval3">eval3</a>,
now have a URL shortener button in the top right corner, that calculates a compressed URL.
A compressed URL contains all the information that was in the original. URLs aren't stored in a database.
<br>
The algorithm:
<ol>
<li>Given a string to compress, find the repeated substrings and their frequencies.
<li>Select the one with the biggest length*frequency, to 'squish' by substituting a smaller,
unused string for the larger one.
<li>Create an 'unsquish' command string to reverse the squish step.
<li>If the substitution would shorten the string more than the command would lengthen it,
<br>then the new string = the unsquish command + the old string with the substitution made.
<br>Otherwise quit.
<li>Goto step 1.
</ol>
</div>

<div class="news">
<span class="date">2011-06-27</span>
Upgraded <a href="/vorp">Vorp</a> graphics and handling a bit.<br>
Now plexode's source is on github, at
<a href="https://github.com/aaronwhyte/plexode">https://github.com/aaronwhyte/plexode</a>.
</div>

<div class="news">
<span class="date">2011-01-23</span>
Added a new game, <a href="/vorp">Vorp</a>, to the nav bar.
</div>

<div class="news">
<span class="date">2010-06-26</span>
Refactored the whole site!<br>
For example, now you can go to <a href="eval3">plexode.com/eval3</a>
instead of <a href="cgi-bin/eval3.py">plexode.com/cgi-bin/eval3.py</a>
<br>All old-style URLs should get redirected to the new URLs. eval2 and eval3 URL hash fragments are preserved, even on IE.
<p>
I also got rid of some cruft, and added some stuff.
</div>

<div class="news">
<span class="date">2009-02-22</span>
Insta-html and eval have a beautiful baby and it is <a href="eval3">eval3</a>.
It is full of wonders.  Here is a snake I made with it:
<a href="eval3#ht=DUDE%20OMG%20%3Cb%20id%3D%22wave%22%20style%3D%22font-size%3A150%25%3B%20color%3Agreen%22%3E%3C%2Fb%3E%20IT%20IS%20A%20SNAKE&ohh=1&ohj=1&jt=var%20a%20%3D%20[]%3B%0Avar%20n%20%3D%20(new%20Date()).getTime()%3B%0Afor%20(var%20i%20%3D%200%3B%20i%20%3C%2020%3B%20%2B%2Bi)%20{%0A%20%20var%20s%20%3D%20Math.sin(n%2F210%20%2B%20i%2F1.1)%20*%2025%20%2B%20Math.sin(n%2F240%20%2B%20i%2F3)%20*%2025%3B%0A%20%20var%20c%20%3D%20-Math.cos(n%2F200%20%2B%20i%2F2)%20*%2025%20-%20Math.cos(n%2F260%20%2B%20i%2F2.9)%20*%2025%3B%0A%20%20a.push(%27%3Cb%20style%3D%22position%3Arelative%3Bleft%3A%27%2C%20s%2C%20%27px%3Btop%3A%27%2C%20c%2C%20%27px%22%3Es%3C%2Fb%3E%20%27)%3B%0A}%0Agebi(%27wave%27).innerHTML%20%3D%20a.join(%27%27)%3B%0A%0An%20%25%20100000%3B%0A&ojh=1&ojj=1&ms=30&oth=0&otj=1&cex=1">A snake.</a>
</div>

<div class="news">
<span class="date">2008-03-02</span>
Now <a href="eval2">eval2</a> saves and loads content using the href
fragment, so you can save a JS program as a bookmark, or send one to a friend.<br>
See <a href="eval2#%2F%2Feval%20every%20100ms!%0Avar%20a%20%3D%20%5B%5D%3B%0Afor%20(var%20i%20%3D%201%3B%20i%20%3C%3D%2020%3B%20%2B%2Bi)%20%7B%0A%20%20var%20n%20%3D%20(new%20Date()).getTime()%3B%0A%20%20var%20s%20%3D%20Math.sin(n%2F200%20%2B%20i)%20*%209%3B%0A%20%20var%20c%20%3D%20-Math.cos(n%2F200%20%2B%20i)%20*%209%3B%0A%20%20a.push('%26nbsp%3B%3Cb%20style%3D%22position%3Arelative%3Bleft%3A'%2C%20s%2C%20'px%3Btop%3A'%2C%20c%2C%20'px%22%3E%23%3C%2Fb%3E%26nbsp%3B')%3B%0A%7D%0Agebi('d').innerHTML%20%3D%20a.join('')%3B%0A''%3B">Super
Fun Time Example URL</a>.
</div>

<div class="news">
<span class="date">Many moons ago...</span>
Welcome to Plexode!<br>
Want to <a href="/fracas">play a game</a>?
</div>
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatMain()

if __name__ == "__main__":
  main()

