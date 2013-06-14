// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview
 */
this.plex = this.plex || {};
plex.dom = {};

/**
 * Gets element by ID.
 * @param {String} id  the element's ID
 * @param {Document} opt_doc  optional document object.  If not specified,
 *   then this uses the global context's window.document.
 * @return the element if any
 */
plex.dom.gebi = function(id, opt_doc) {
  return (opt_doc || document).getElementById(id);
};

plex.dom.ce = function(name, opt_parent, opt_doc) {
  var e = (opt_doc || document).createElement(name);
  if (opt_parent) {
    opt_parent.appendChild(e);
  }
  return e;
};

plex.dom.ct = function(text, opt_parent, opt_doc) {
  var e = (opt_doc || document).createTextNode(text);
  if (opt_parent) {
    opt_parent.appendChild(e);
  }
  return e;
};

plex.dom.getClasses = function(node) {
  return node.className.split(/\s/);
};

plex.dom.appendClass = function(node, className) {
  var classes = plex.dom.getClasses(node);
  if (!plex.array.contains(classes, className)) {
    node.className += ' ' + className;
  }
};

plex.dom.prependClass = function(node, className) {
  var classes = plex.dom.getClasses(node);
  if (!plex.array.contains(classes, className)) {
    node.className = className + ' ' + node.className;
  }
};

plex.dom.removeClass = function(node, className) {
  var classes = plex.dom.getClasses(node);

  var index = plex.array.indexOf(classes, className);
  if (index >= 0) {
    classes.splice(index, 1);
    node.className = classes.join(' ');
  }
};

/**
 * Computes a dom node's bounding rectangle.
 * @return {plex.Rect}  a new Rect, or opt_outRect if one is supplied
 */
plex.dom.getBounds = function(node, opt_outRect) {
  var e = node;
  var top = e.offsetTop;
  var left = e.offsetLeft;
  while (e = e.offsetParent) {
    top += e.offsetTop;
    left += e.offsetLeft;
  }
  var right = left + node.offsetWidth;
  var bottom = top + node.offsetHeight;
  var rect = opt_outRect ? opt_outRect : new plex.Rect();
  rect.setXyxy(left, top, right, bottom);
  return rect;
};

plex.dom.getRelativeScrollRect = function(node) {
  return plex.rect.createXywh(node.scrollLeft, node.scrollTop,
                              node.offsetWidth, node.offsetHeight);
};

plex.dom.getRelativeOffsetRect = function(node) {
  return plex.rect.createXywh(node.offsetLeft, node.offsetTop,
                              node.offsetWidth, node.offsetHeight);
};

plex.dom.scrollIntoView = function(node, scroller) {
  var rect = plex.dom.getRelativeOffsetRect(node);
  var view = plex.dom.getRelativeScrollRect(scroller);
  var scrollLeft = Math.max(0, view.getLeft() - rect.getLeft());
  var scrollRight = Math.max(0, rect.getRight() - view.getRight());
  var scrollUp = Math.max(0, view.getTop() - rect.getTop());
  var scrollDown = Math.max(0, rect.getBottom() - view.getBottom());
  var scrollX = 0;
  var scrollY = 0;
  if (!scrollLeft || !scrollRight) {
    scrollX = scrollRight - scrollLeft;
  }
  if (!scrollUp || !scrollDown) {
    scrollY = scrollDown - scrollUp;
  }
  log([scrollX, scrollY]);
  if (scrollX) scroller.scrollLeft += scrollX;
  if (scrollY) scroller.scrollTop += scrollY;
};
