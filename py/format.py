links = [
  ("main", "/"),
  ("insta-html", "/insta-html/"),
  ("eval", "/eval/"),
  ("eval2", "/eval2/"),
  ("eval3", "/eval3/"),
  ("fracas", "/fracas/"),
  ("vorp", "/vorp/"),
]

def headStart(name, depth):
    toTop = '../' * depth
    return ''.join(['''<!DOCTYPE HTML>
<html><head><title>plexode:''', name, '''</title>
<link rel="stylesheet" type="text/css" href="''', toTop, '''css/plexode2.css">
<script src="''', toTop, '''js/util.js"></script>
'''])

def headStartQuirks(name, depth):
    toTop = '../' * depth
    return ''.join(['''<html><head><title>plexode:''', name, '''</title>
<link rel="stylesheet" type="text/css" href="''', toTop, '''css/plexode2.css">
<script src="''', toTop, '''js/util.js"></script>
'''])

def plexScripts():
    html = []
    names = [
        "array",
        "dom",
        "event",
        "func",
        "ids",
        "js/parser",
        "js/props",
        "js/token",
        "object",
        "pane",
        "point",
        "pubsub",
        "rect",
        "string",
        "textarea",
        "time",
        "type",
        "url",
        "wij/acinput",
        "wij/jsac",
        "wij/log",
        "wij/menu",
        "wij/tachanges",
        "window"]
    for name in names:
        html.append('<script src="../js/plex/')
        html.append(name)
        html.append('.js"></script>\n')
    return ''.join(html)


def roundDiv(innerHtml, innerClass):
    return ''.join([
        '<div style="border-style:solid;border-width:2px 0;margin:0 4px">',
        '<div style="border-style:solid;border-width:2px 0;margin:0 -2px">',
        '<div class="', innerClass, '" ',
        'style="border-style:solid;border-width:0 2px;margin:0 -2px">',
        innerHtml,
        '</div></div></div>'])


def roundLeftDiv(innerHtml, innerClass):
    return ''.join([
        '<div style="border-style:solid;border-width:4px 0px;margin:0 0 0 8px">',
        '<div style="border-style:solid;border-width:4px 0px;margin:0 0 0 -4px">',
        '<div class="', innerClass, '" ',
        'style="border-style:solid;border-width:0 0 0 4px;margin:0 0 0 -4px">',
        innerHtml,
        '</div></div></div>'])


def roundRightDiv(innerHtml, innerClass):
    return ''.join([
        '<div style="border-style:solid;border-width:4px 0px;margin:0 8px 0 0">',
        '<div style="border-style:solid;border-width:4px 0px;margin:0 -4px 0 0">',
        '<div class="', innerClass, '" ',
        'style="border-style:solid;border-width:0 4px 0 0;margin:0 -4px 0 0">',
        innerHtml,
        '</div></div></div>'])


def roundTopDiv(innerHtml, innerClass):
    return ''.join([
        '<div style="border-style:solid;border-width:4px 0 0;margin:0 8px">',
        '<div style="border-style:solid;border-width:4px 0 0;margin:0 -4px">',
        '<div class="', innerClass, '" ',
        'style="border-style:solid;border-width:0 4px;',
        'margin:0 -4px">',
        innerHtml,
        '</div></div></div>'])


def roundBottomDiv(innerHtml, innerClass):
    return ''.join([
        '<div style="border-style:solid;border-width:0 0 4px;margin:0 8px">',
        '<div style="border-style:solid;border-width:0 0 4px;margin:0 -4px">',
        '<div class="', innerClass, '" ',
        'style="border-style:solid;border-width:0 4px;',
        'margin:0 -4px">',
        innerHtml,
        '</div></div></div>'])


def navHere(navTuple):
    return ''.join([
        '&nbsp;<span class="nav">',
        navTuple[0],
        '</span>\n'])


def navLink(navTuple):
    return ''.join([
        '&nbsp;<a class="nav" href="', navTuple[1], '">',
        navTuple[0],
        '</a>\n'])

def plexodeLogo():
    html = ['<span class="logo">']
    logo = []
    logo.extend('pleXode')
    for letter in logo:
        if letter == 'X':
            html.append('<span style="position:relative;top:0.11em">X</span>')
        elif letter == 'p':
            html.append('<b>p</b>')
        else:
            html.append(letter)
    html.append('</span>\n')
    return ''.join(html)


def navDiv(name):
    html = ['<div class="top">']
    html.append('<div class="copyright">Copyright 2006 Aaron Whyte</div>')
    html.append(plexodeLogo())
    for link in links:
        if link[0] == name:
            html.append(navHere(link))
        else:
            html.append(navLink(link))
    html.append('</div>')
    return ''.join(html)


def mainDiv(innerHtml):
    return innerHtml


def table(attribs, rows):
    html = ['<table ' + attribs + '>\n']
    for row in rows:
        html.append('<tr>\n')
        for cell in row:
            html.append('<td>' + cell + '</td>\n')
        html.append('</tr>\n')
    html.append('</table>\n')
    return ''.join(html)
        

def footer():
    return "</body></html>"
