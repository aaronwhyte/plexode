import os
import os.path
import sys

def ensureDir(f):
  d = os.path.dirname('%s/' % f)
  print 'ensuring %s' % d
  if not os.path.exists(d):
    os.makedirs(d)


def writePublicHtml(bdir, path, content):
  print "  writing %s/index.html..." % path
  d = os.path.join(bdir, 'public_html', path)
  ensureDir(d)
  fname = os.path.join(d, 'index.html')
  f = open(fname, 'w')
  f.write(content)
  f.close()
