links = [
  ("main", ""),
  ("insta-html", "insta-html/"),
  ("eval", "eval/"),
  ("eval2", "eval2/"),
  ("eval3", "eval3/"),
  ("fracas", "fracas/"),
#  ("minigames", "minigames/"),
  ("vorp", "vorp/"),
#  ("chordo", "chordo/"),
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
        "map",
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
        "urlsquisher",
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


def navHere(navTuple):
    return ''.join([
        '&nbsp;<span class="nav">',
        navTuple[0],
        '</span>\n'])


def navLink(navTuple, level):
    return ''.join([
        '&nbsp;<a class="nav" href="', '../' * level, navTuple[1], '">',
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


def navDiv(name, level):
    html = ['<div class="top">']
    html.append('<div class="copyright">Copyright 2006 Aaron Whyte</div>')
    html.append(plexodeLogo())
    for link in links:
        if link[0] == name:
            html.append(navHere(link))
        else:
            html.append(navLink(link, level))
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
