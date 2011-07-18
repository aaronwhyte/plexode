#!/usr/bin/env python

import format

def formatMain():
  name = 'main'
  h = []
  h.append(format.headStart(name, 0))
  h.append('</head><body>')
  h.append(format.navDiv(name, 0))
  h.append(format.mainDiv("""
<p>
<i>2011-06-27</i><br>
Upgraded <a href="/vorp">Vorp</a> graphics and handling a bit.<br>
Now plexode's source is on github, at
<a href="https://github.com/aaronwhyte/plexode">https://github.com/aaronwhyte/plexode</a>.
<p>
<i>2011-01-23</i><br>
Added a new game, <a href="/vorp">Vorp</a>, to the nav bar.
<p>
<i>2010-06-26</i><br>
Refactored the whole site!<br>
For example, now you can go to <a href="eval3">plexode.com/eval3</a>
instead of <a href="cgi-bin/eval3.py">plexode.com/cgi-bin/eval3.py</a>
<br>All old-style URLs should get redirected to the new URLs. eval2 and eval3 URL hash fragments are preserved, even on IE.
<p>
I also got rid of some cruft, and added some stuff.
<p>
<i>2009-02-22</i><br>
Insta-html and eval have a beautiful baby and it is <a href="eval3">eval3</a>.
It is full of wonders.  Here is a snake I made with it:
<a href="eval3#ht=DUDE%20OMG%20%3Cb%20id%3D%22wave%22%20style%3D%22font-size%3A150%25%3B%20color%3Agreen%22%3E%3C%2Fb%3E%20IT%20IS%20A%20SNAKE&ohh=1&ohj=1&jt=var%20a%20%3D%20[]%3B%0Avar%20n%20%3D%20(new%20Date()).getTime()%3B%0Afor%20(var%20i%20%3D%200%3B%20i%20%3C%2020%3B%20%2B%2Bi)%20{%0A%20%20var%20s%20%3D%20Math.sin(n%2F210%20%2B%20i%2F1.1)%20*%2025%20%2B%20Math.sin(n%2F240%20%2B%20i%2F3)%20*%2025%3B%0A%20%20var%20c%20%3D%20-Math.cos(n%2F200%20%2B%20i%2F2)%20*%2025%20-%20Math.cos(n%2F260%20%2B%20i%2F2.9)%20*%2025%3B%0A%20%20a.push(%27%3Cb%20style%3D%22position%3Arelative%3Bleft%3A%27%2C%20s%2C%20%27px%3Btop%3A%27%2C%20c%2C%20%27px%22%3Es%3C%2Fb%3E%20%27)%3B%0A}%0Agebi(%27wave%27).innerHTML%20%3D%20a.join(%27%27)%3B%0A%0An%20%25%20100000%3B%0A&ojh=1&ojj=1&ms=30&oth=0&otj=1&cex=1">A snake.</a>
<p>
<i>2008-03-02</i><br>
Now <a href="eval2">eval2</a> saves and loads content using the href
fragment, so you can save a JS program as a bookmark, or send one to a friend.<br>
See <a href="eval2#%2F%2Feval%20every%20100ms!%0Avar%20a%20%3D%20%5B%5D%3B%0Afor%20(var%20i%20%3D%201%3B%20i%20%3C%3D%2020%3B%20%2B%2Bi)%20%7B%0A%20%20var%20n%20%3D%20(new%20Date()).getTime()%3B%0A%20%20var%20s%20%3D%20Math.sin(n%2F200%20%2B%20i)%20*%209%3B%0A%20%20var%20c%20%3D%20-Math.cos(n%2F200%20%2B%20i)%20*%209%3B%0A%20%20a.push('%26nbsp%3B%3Cb%20style%3D%22position%3Arelative%3Bleft%3A'%2C%20s%2C%20'px%3Btop%3A'%2C%20c%2C%20'px%22%3E%23%3C%2Fb%3E%26nbsp%3B')%3B%0A%7D%0Agebi('d').innerHTML%20%3D%20a.join('')%3B%0A''%3B">Super
Fun Time Example URL</a>.
Good idea, Julie!
<p>
<i>Many moons ago...</i><br>
Welcome to Plexode!<br>
Want to <a href="/fracas">play a game</a>?
"""))
  h.append(format.footer())
  return ''.join(h)


def main():
  print formatMain()

if __name__ == "__main__":
  main()

