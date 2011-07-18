import os
import os.path
import shutil
import subprocess

import py
from py import *

# where will the built files go?
bdir = "../../build/plexode"

def ensureDir(f):
  d = os.path.dirname(f)
  if not os.path.exists(d):
    os.makedirs(d)

def writePublicHtml(path, content):
  print "  " + path + "/index.html"
  d = bdir + '/public_html' + path
  ensureDir(d)
  f = open(d + '/index.html', 'w')
  f.write(content)
  f.close()

def buildPlexode():
  print "START building plexode"

  if os.path.exists(bdir):
    print "removing old " + bdir
    shutil.rmtree(bdir)
  
  print "creating " + bdir
  os.makedirs(bdir)
  
  print "copying stuff to " + bdir
  shutil.copytree("cgi-bin", bdir + "/cgi-bin")
  shutil.copytree("public_html", bdir + "/public_html")
  
  print "generating index.html files"
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
  
  print "DONE building plexode"


def getJsFileNamesInPath(startPath):
  js = []
  # Add all JS files in the vorp tree
  for root, dirs, files in os.walk(startPath):
    for fname in files:
      if (fname[-3:] == ".js"):
        js.append(os.path.join(root, fname))
  return js

def getVorpJsFileNames():
  js = []
  prefix = 'public_html/js/'
  js.extend(getJsFileNamesInPath(prefix + 'gaam'))
  miscDeps = [
    'circularqueue.js',
    'gameutil.js',
    'skipqueue.js',
    'util.js',
    'vec2d.js',
    'plex/array.js',
    'plex/point.js',
    'plex/rect.js',
    'plex/type.js',
  ]
  for dep in miscDeps:
    js.append(prefix + dep)

  vorpJs = getJsFileNamesInPath('public_html/vorp')
  for dep in vorpJs:
    if dep[-8:] != 'level.js':
      js.append(dep)

  return js

def getVorpJsCompFlags(jsFileNames):
  flags = []
  flags.extend(['--js_output_file', bdir + '/public_html/vorp/vorp-compiled.js'])
  flags.extend(['--compilation_level', 'WHITESPACE_ONLY'])
  #flags.extend(['--compilation_level', 'SIMPLE_OPTIMIZATIONS'])

  warnings = ['checkVars', 'undefinedVars', 'missingProperties']
  for warning in warnings:
    flags.append('--jscomp_warning')
    flags.append(warning)

  for jsFileName in jsFileNames:
    flags.append('--js')
    flags.append(jsFileName)
    
  return flags

def compileJs(pathToCompilerJar, jsCompFlags):
  argList = ['java', '-jar', pathToCompilerJar]
  argList.extend(jsCompFlags)
  print 'calling'
  print ' '.join(argList)
  print 'now...'
  subprocess.check_call(argList)

def main():
  buildPlexode()
  compileJs(
    '../../tools/closure-compiler/compiler.jar',
    getVorpJsCompFlags(getVorpJsFileNames()))

if __name__ == "__main__":
  main()


