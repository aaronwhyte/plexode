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
It's an anagram for "explode!"<br>
This site started as an HTML rapid-prototyping tool back in the early 2000's.
It's got some web development tools, a couple of action-packed JavaScript/HTML games, and some wiggly demos.
<br>
All the source is on <a href="https://github.com/aaronwhyte/plexode/">github</a>.
<div>

<div class="news">
<span class="date">2015-09-26</span>
Here's a hella old eval3
<a href="http://plexode.com/eval3/#s=aekVQXANJVQMbAx10AYMeFBERAYIeF5sBSkUePQNEQk+mAXilA1mEGxJRWQGHAVNGRRwBfRtCQ1RQTVZVRrx+spq0ph8dEHQfPU8dSRIfAS5KRElCRk0P4QHj2tzeTQ0BSEpXRgFWVAFQVlMBUblESvPxSEZOKgCAIoEwuGjZFQkFIiEwtB4DBoDJaRSZwB52V0DgsHhMLFqmDjTaZgAJxBIKAJcaZEIgPI5KJpNGhVLRNIyuAhHIpFj8qlhDIzrJ4xIRVJMmkBPlYPJxQdo1KAJBwSdNSBVIpRNJRPI1PBNTANVq8srNbrtfCIPDVWnoPslcqFSdNotViB5EJpQKhGodFo9sl0wv1JlhUKpTKBMI2CL0hJ8jn5CKZFk0ov8vmMzms3nU7Ad1n9BvlGteDpdNt9RCQPs9p0lYrWoqWruWusewroRqloCW1tu3qGqs+9t1m2YBufD34J3IB4O9u95vdE0d1wBNwVKwuHxOLxsjIxaIxUykp0vWmU0mymAibCM80ugrWi7EsyJEqNoC26B/644PBEGVyfsm28XV0F6fNvXWfQD3aYhim9fFQnTgx9nLfx+39WiAICWCGwRgVbIHdJfYKZeDIOdxpGMKpjgBE90XkWyEoJdVl3oZp605Z1dYWcwDloBOGgPBMGFykADwVOkaQxCoDFoBWJmBb2KYQUiLEiAFTDFaNlXwUB8oUb1TFOXCUFyA8FHJWVUJnf6al1lV3YtSM3RVjJ5o3Zl6gDTgm3vUqNJiXWZGxcF/ZIBma2oj8EwPBii3FBKiFooqBl4gig2WlOcWGg+c5ZZETp4oGYITiWhGnbhtF1FIVhCEUU1ENsJD0mWF5DawF5oBeVKeipn6mjVbI+A+u3+gF/gTVSTAqOmIWlnKK3eAGonjFVJ3ldkQjtgxbg4KNRQBB5/qTXVhipFQTVEYprLQUphxVuwCRpFRWgJFUC1or0AQQAEE1gf6UVIqKDC5YUUC5ii3JWWy37hEm47lBacSoTVqbPb26BPuq87ub28bzvW975vsFknv7AAOwJpMFyB4hVwmEDTliLk1EipE+sKmmloWq3Hb2rqwrIVa0rajJEmiSrlmilsOcp+ZoXRbLSle1M3te2dUwy3mwuARVFuRu8U1u3carLHLrMauNSyAULy2vIxPvjKL/aTN8GzDMsL2bFRCxdcXN2e6dqYrUX+1Npch3G9tzvlqgRBMCgQ5JSN4y/CMK5jMea1aLSoxI/RDEoCSmKgqgDbXEioA8/RVCQUBPMYWZ3AgExFAhpJZEiMBOYoWTpFo6RJOkVzptiXjja9W9fuLYmrUjymEr8Ro4O65Hre17/Sg3XGk9zG8d2vwABFr3wBvDb8i42+L6A+igLuX53ZxZigWcz9/nSX57W3T0QAtYf8NMcZkDJGCHGjAvUBwAngPFAtLaqIBgBTtAteDenOs0MaBACAR2EgBASGELTEgIi8hEB0AImoSPlACAxcgaQ1ABfiJprQT4Njjd4FB3y9IYQyE28E0kG0WBhCqxIBIYgyAKDKv05omykQ4h1ClZ790OnMCqBBgY04nrtimc0DJzIvvHNJFoBIoBOMrUmcwCUXoqPHcoaQKpSCHgDH+JIAYEgIxybeEmOoEo8hVCXHwAYXgAA==">
gnomes demo</a>. These gem-coveting dungeon dwellers were going to be the enemies in Fracas II.
</div>

<div class="news">
<span class="date">2015-09-25</span>
Here's another little vorp level:
<a href="http://plexode.com/vorp/?20150925#level=data~aeotB48JkRpIaDqVqccRUA1qIPTCnxQNuhOhyozgqqACkKAGwCQoGiYaMxoaHDIkLw8SKx4sMC8eMCkm0TUkIswcNDUXQ0dMMsAyGjUeLywcJxrBTxYdQy4lFgYoIwzRJR4qK1rNYhojKM9eHWNGMignmCbQHDAjZTk9FicSLjFwMjU9Eic1n2XJuxVaJCInZC14wDAaKNGlcXlW0BRLNx8ItVQNDvh7wVcrQzrxRv2DhUzQJpg2BA56NQJJYKolsJ1YBF%2FBYGhWSA4KBlZMV%2FSWEwyKwqILwGhYzBlkwsMssJSQLIl9o9poczBaSQ9aQdMIoJJldqeHU%2BDhdRyynsRjMpWA0LolptFyodLBd0xdVLauO9frJEBdWgOHMGAriqK2MJlDq8MJaNxVcp1VosMO%2BJQ8JSo01RgoxFzmM1xLTxFhmSKV%2BPEK2JGXa6o92QcNROQLnMK50vB5aBExfHuWpGjXBKozqGmXXwRX7LEJChvfULB5vVhBGTzi2aVIY7hGeRUynaR5bWH5iD7JP8fog4KsPoZlhRvPcpcVaMcKob5rOl99XbRfUQHRz23eyPcZH%2B%2BsXb31teJqZAqcRDneCbcg03ZsksAYCGCU58sgUZoEOkhEFkvyWOqkDZNs7rpPuCz5rUV6glmiR7DOCrxqyUikvAjbilEzywxbADPRgbD5xmZydwhEphHo5x0gsYsgEeyz%2BSEdzOJEMC%2BKWnMELQXRZuydg0ri6pkvdD53tm%2BSRjOcMwJycqeNyC7cuQSJJtyTiGxOME2Sa5jMzZCZxHwZc2E0ChEp7OAzgwe4LpICYLT%2Bpp3zuCxqTZERhAwCVDp2ix7p3SQ0UCi08jODLBUxNdOKAfQMUkviGHhSLcspE7vg1SRQQ%2BM8%2BUk3wLTNRlOHersTgqHwfAAA=">surf's up and zombies to go</a>
<br>It's already pretty hard. But to make it insane-o challenging, try it without your tractor beam - use yourself as bait to draw the zombies into the grip-switches.
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
<b>cthulhu</b></a>.
<p>
The new compressor turns the form fields into a JSON string,
percent-encodes all but the most vanilla characters,
does static-dictionary substitution to make some common strings shorter (like "document" and "function"),
then uses Lempel-Ziv to compress repeated strings,
and finally encodes everything in linkifier-friendly base64.
<p>
Aaaand in <a href="/vorp">Vorp</a>, it should be easier to make small movements with the little pink square that is you -
better for lining up throws, or getting onto a beam sensor.
</div>

<div class="news">
<span class="date">2013-02-13</span>
I've been working on <a href="./vorp">Vorp</a>!<br>
Now there are ten lesson levels, and a couple new challenging levels.
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

