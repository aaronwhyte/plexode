#!/usr/bin/python

import os
import os.path
import shutil
import subprocess
import sys
import time
import py
from py import *

# The basic file layout extends beyond what's in git.
# You can have a root directory anywhere.  I call it "dev", but you can call it
# anything, as it's never referred to by name in the code.
#
# The closure compiler goes here:
# dev/tools/closure-compiler/compiler.jar
#
# The git directory for project plexode goes here:
# dev/src/plexode
# so that this file ends up at
# dev/src/plexode/make.py
#
# Invoke it from dev/src/plexode, like this:
# ./make.py
#
# That erases the ../../build/plexode directory and rebuilds it, like this:
# dev/build/plexode/cgi-bin/{some python CGI scripts}
# dev/build/plexode/public_html/index.html
# dev/build/plexode/public_html/insta-html/index.html
# etc.
# dev/build/plexode/public_html/vorp/index.html
# dev/build/plexode/public_html/vorp/vorp_sometimestamp.js
# etc.


def buildPlexode(bdir):
  print "START building plexode"

  if os.path.exists(bdir):
    print "removing old %s" % bdir
    shutil.rmtree(bdir)
  
  print "creating %s" % bdir
  os.makedirs(bdir)
  
  print "copying stuff to %s" % bdir
  shutil.copytree("cgi-bin", os.path.join(bdir, 'cgi-bin'))
  shutil.copytree("public_html",  os.path.join(bdir, 'public_html'))

  print "generating non-vorp index.html files"
  build.writePublicHtml(bdir,'', mainpage.formatMain())
  build.writePublicHtml(bdir, 'insta-html', instahtml.formatInstaHtml())
  build.writePublicHtml(bdir, 'eval', eval1.formatEval())
  build.writePublicHtml(bdir, 'eval2', eval2.formatEval2())
  build.writePublicHtml(bdir, 'eval3', eval3.formatEval3())
  build.writePublicHtml(bdir, 'eval3quirks', eval3.formatEval3(quirks=True))
  build.writePublicHtml(bdir, 'fracas', fracas.formatFracas())
  build.writePublicHtml(bdir, 'chordo', chordo.formatChordo())
  build.writePublicHtml(bdir, 'u', unsquish.formatUnsquish())

  print "compiling vorp JS"
  vorpJsName = 'vorp_%s.js' % str(int(time.time() * 1000))
  vorpJsPublicHtmlPath = os.path.join('vorp', vorpJsName)
  concatenateJs(bdir, getVorpJsFileNames(), vorpJsPublicHtmlPath)

#  print "compiling ved JS"
#  vedJsName = 'ved_%s.js' % str(int(time.time() * 1000))
#  vedJsPublicHtmlPath = os.path.join('vorp/edit', vedJsName)
#  concatenateJs(bdir, getVedJsFileNames(), vedJsPublicHtmlPath)

  print "generating vorp index.html files"
#  build.writePublicHtml(bdir, 'vorp', vorp.formatVorp())
#  vorp.writePublicHtmlForAllLevels(bdir, "vorp/", vorpJsName);
  build.writePublicHtml(bdir, 'vorp', ved.formatVed(vorpJsName))

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
  js.extend(getJsFileNamesInPath('%splex' % prefix))
  js.extend(getJsFileNamesInPath('%sgaam' % prefix))
  js.extend(getJsFileNamesInPath('%sged' % prefix))
  js.extend(getJsFileNamesInPath('%sgraf' % prefix))
  js.extend(getJsFileNamesInPath('%sstor' % prefix))
  js.extend(getJsFileNamesInPath('%sopstor' % prefix))
  js.extend(getJsFileNamesInPath('%s../vorp/levels' % prefix))
  miscDeps = [
    'circularqueue.js',
    'depinj.js',
    'gameutil.js',
    'skipqueue.js',
    'util.js',
    'vec2d.js',
    'plex/array.js',
    'plex/event.js',
    'plex/key.js',
    'plex/keys.js',
    'plex/loop.js',
    'plex/map.js',
    'plex/object.js',
    'plex/point.js',
    'plex/rect.js',
    'plex/stringset.js',
    'plex/type.js',
    'plex/window.js',
  ]
  for dep in miscDeps:
    js.append('%s%s' % (prefix, dep))

  js.extend(getJsFileNamesInPath('public_html/vorp/js'))
  js.extend(getJsFileNamesInPath('public_html/ved'))

  return js

def concatenateJs(bdir, sourcePaths, outputPublicHtmlPath):
  outFile = open(os.path.join(bdir, 'public_html', outputPublicHtmlPath), 'w');
  for sourcePath in sourcePaths:
    sourceFile = open(sourcePath, 'r')
    outFile.write(sourceFile.read())
    sourceFile.close();
    outFile.write("\n");
  outFile.close()

def getJsCompFlags(bdir, jsFileNames, outputFileName):
  flags = []
  flags.extend(['--js_output_file', '%s/public_html/%s' % (bdir, outputFileName)])
  flags.extend(['--compilation_level', 'WHITESPACE_ONLY'])
  #flags.extend(['--compilation_level', 'SIMPLE_OPTIMIZATIONS'])
  # SIMPLE_OPTIMIZATIONS works, with lots of good warnings but little compression win.
  # ADVANCED_OPTIMIZATIONS doesn't work yet.

  warnings = ['checkVars', 'undefinedVars', 'missingProperties']
  for warning in warnings:
    flags.append('--jscomp_warning')
    flags.append(warning)

  for jsFileName in jsFileNames:
    flags.append('--js')
    flags.append(jsFileName)

  return flags

def compileJs(pathOfCompilerJar, jsCompFlags):
  compilerJarPath = os.path.join(pathOfCompilerJar, 'compiler.jar')
  while not os.path.isfile(compilerJarPath):
    print 'You must download the closure compiler to %s' % compilerJarPath
    response = raw_input('Would you like to download the compiler? [Y/n] ')
    if not response or response.upper() == 'Y':
      downloadClosure(pathOfCompilerJar)
    else:
      print 'not downloading'
      exit(1)
  argList = ['java', '-jar', compilerJarPath]
  argList.extend(jsCompFlags)
  runCommand(argList)


def downloadClosure(pathOfCompilerJar):
  build.ensureDir(pathOfCompilerJar)
  argList = [
      'curl', '-O',
      'http://closure-compiler.googlecode.com/files/compiler-latest.zip']
  runCommand(argList)
  argList = [
      'unzip', 'compiler-latest.zip', 'compiler.jar', '-d', pathOfCompilerJar]
  runCommand(argList)
  argList = ['rm', 'compiler-latest.zip']
  runCommand(argList)


def runCommand(argList):
  print 'calling'
  print ' '.join(argList)
  print 'now...'
  subprocess.check_call(argList)


def printHelp():
  print("Usage: make.py -build_dir DIRECTORY")
    

def main():
  if len(sys.argv) == 3 and sys.argv[1] == '-build_dir':
    buildPlexode(sys.argv[2])
  else:
    printHelp()
    sys.exit(2)
    

if __name__ == "__main__":
  main()

