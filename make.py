import os
import os.path
import shutil
import py
from py import *

print "MAKING THE PLEXODE avec le PYTHON"

def ensureDir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.makedirs(d)

bdir = "../../build/plexode"

def writePublicHtml(path, content):
  d = bdir + '/public_html' + path
  ensureDir(d)
  f = open(d + '/index.html', 'w')
  f.write(content)
  f.close()
  

print "maybe removing " + bdir
if os.path.exists(bdir):
  print "definitely removing " + bdir
  shutil.rmtree(bdir)

print "recreating " + bdir
os.makedirs(bdir)

print "copying most stuff to " + bdir
shutil.copytree("cgi-bin", bdir + "/cgi-bin")
shutil.copytree("public_html", bdir + "/public_html")

print "generating stuff using Python..."

writePublicHtml('', mainpage.formatMain())
writePublicHtml('/insta-html', instahtml.formatInstaHtml())
writePublicHtml('/eval', eval1.formatEval())
writePublicHtml('/eval2', eval2.formatEval2())
writePublicHtml('/eval3', eval3.formatEval3())
writePublicHtml('/eval3quirks', eval3quirks.formatEval3Quirks())
writePublicHtml('/fracas', fracas.formatFracas())
writePublicHtml('/vorp', vorp.formatVorp())
writePublicHtml('/vorp/level1', vorp.formatVorpLevel("Level 1", "first level ever"))
writePublicHtml('/vorp/level2', vorp.formatVorpLevel("Level 2", "wall of death test"))
writePublicHtml('/vorp/level3', vorp.formatVorpLevel("Level 3", "first proper level"))
writePublicHtml('/vorp/level4', vorp.formatVorpLevel("Level 4", "sensor and door test"))
writePublicHtml('/vorp/level5', vorp.formatVorpLevel("Level 5", "zero-gravity grip-switch test"))
writePublicHtml('/vorp/level6', vorp.formatVorpLevel("Level 6", "second proper level"))


ignore = """
mkdir -p $bdir/public_html/vorp/level1
mkdir -p $bdir/public_html/vorp/level2
mkdir -p $bdir/public_html/vorp/level3
mkdir -p $bdir/public_html/vorp/level4
mkdir -p $bdir/public_html/vorp/level5
mkdir -p $bdir/public_html/vorp/level6
python py/vorp/level1.py > $bdir/public_html/vorp/level1/index.html
python py/vorp/level2.py > $bdir/public_html/vorp/level2/index.html
python py/vorp/level3.py > $bdir/public_html/vorp/level3/index.html
python py/vorp/level4.py > $bdir/public_html/vorp/level4/index.html
python py/vorp/level5.py > $bdir/public_html/vorp/level5/index.html
python py/vorp/level6.py > $bdir/public_html/vorp/level6/index.html
"""

print "Ding!  Your Plexode is ready to eat!"

