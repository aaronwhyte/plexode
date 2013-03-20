links = [
  ("insta-html", "insta-html/"),
  ("eval", "eval/"),
  ("eval3", "eval3/"),
  ("fracas", "fracas/"),
  ("vorp", "vorp/"),
#  ("chordo", "chordo/"),
]

def headStart(name, depth, quirks=False):
    toTop = '../' * depth
    doctype = '<!DOCTYPE HTML>\n'
    if quirks:
      doctype = ''
    return ''.join([doctype, '''<html><head><title>plexode:''', name, '''</title>
<link rel="stylesheet" type="text/css" href="''', toTop, '''css/plexode3.css">
<script src="''', toTop, '''js/util.js"></script>
'''])

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
    html = ['<a href="/" class="logo">']
    logo = []
    logo.extend('pleXode')
    for letter in logo:
        if letter == 'X':
            html.append('<span style="position:relative;top:0.11em">X</span>')
        elif letter == 'p':
            html.append('<b>p</b>')
        else:
            html.append(letter)
    html.append('</a>\n')
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
