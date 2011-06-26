// Ancient code for exploring the DOM.

/**
 * Iterator for traversing a DOM tree, including frames and iframes.
 * "next()" returns null when there are no more nodes in the tree.
 * Traverses down into frames and iframes, too.
 * Has three functions: next(), getDepth(), and getAncestors().
 * @param topNode
 * @param {number=} maxDepth  optional limit on tree depth
 * @constructor
 */
function NodeIterator(topNode, maxDepth) {
  var node = topNode;
  var depth = 0;
  var frames = [];

  function goDeeper() {
    return !maxDepth || depth < maxDepth;
  }
  
  // depth first search
  this.next = function() {
    if (node == null) {
      // ran off the end of the tree, punk!
    } else if (goDeeper() && 
      (node.nodeName == "IFRAME" || node.nodeName == "FRAME")) {
      frames.push(node); // push the frame onto the stack
      node = node.contentWindow.document;
      ++depth;
    } else if (goDeeper() && node.firstChild) {
      node = node.firstChild;
      ++depth;
    } else if (node.nextSibling) {
      node = node.nextSibling;
    } else if (node == topNode) {
      // we started at a leaf node.  don't climb, just stop
      node = null;
    } else {
      // go up and to the right
      var done = false;
      while (! done) {
        if (node.parentNode) {
          if (node.parentNode == topNode) {
            node = null;
            done = true;
          } else if (node.parentNode.nextSibling) {
            node = node.parentNode.nextSibling;
            done = true;
          } else {
            node = node.parentNode;
            // keep scanning
          }
        } else if (frames.length) {
          // pop a frame off the stack
          node = frames.pop();
          if (node.nextSibling) {
            node = node.nextSibling;
            done = true;
          }
          // otherwise we'll try going up and to the right again.
        } else {
          node = null;
          done = true;
        }
        --depth;
      }
    }
    return node;
  };
  
  this.getDepth = function() {
    return depth;
  };

  this.getAncestors = function() {
    var a = node;
    var ancestors = [];
    var frameDepth = frames.length;
    while (a) {
      if (a.parentNode) {
        a = a.parentNode;
      } else if (frameDepth) {
        --frameDepth;
        a = frames[frameDepth];
      } else {
        a = null;
      }
      if (a) ancestors.push(a);
    }
    return ancestors;
  };
}


/**
 * @return a string with info about a node, including 
 * text, src, id, name, className, cssText
 */
function nodeSnippet(node) {
  var row = [];
  
  /* push text */
  function p(t) {
    row.push(t);
  }
  
  /* push attribute if it's set */
  function pa(a) {
    if (node[a]) {
      p(', ');
      p(a);
      p(':');
      p(node[a]);
    }
  }
  
  if (node.nodeName[0] == '#') {
    p(node.nodeName);
  } else {
    p('<');
    p(node.nodeName);
    p('>');
  }
  
  if (node.nodeName == '#text') {
    p(":");
    p(node.nodeValue);
  }
  
  var attribs = ['src', 'id', 'name', 'className'];
  for (var i = 0; i < attribs.length; ++i) {
    pa(attribs[i]);
  }
  
  if (node.style && node.style.cssText) {
    p(', cssText:');
    p(node.style.cssText);
  }

  return row.join('');
}

function isEmptyTextNode(node) {
  return node.nodeName == '#text' && node.nodeValue.match(/^\s*$/);
}

/**
 * @return the node as numbered by outline().
 * Skips empty text nodes.
 */
function outlinedNode(topNode, rowNum, maxDepth) {
  topNode = topNode || document;
  var it = new NodeIterator(topNode, maxDepth);
  var rows = 1;
  for (var node = it.next(); node != null; node = it.next()) {
    if (!isEmptyTextNode(node)) {
      if (rows == rowNum) return node;
      rows++;
    }
  }
  return null;
}

/**
 * @return a text string outline of the node.  Each node is numbered,
 * and you can get the node at that number using outlinedNode().
 * Skips empty text nodes.
 */
function outline(topNode, maxDepth) {
  var returnNode = null;

  function getRowText(depth, node) {
    var text = rows.length + ') ';
    for (var i = 1; i < depth; ++i) {
      text += ' -' + i + '- ';
    }
    text += nodeSnippet(node);
    return text;
  }

  var it = new NodeIterator(topNode, maxDepth);
  var rows = [];
  var node;
  rows.push(getRowText(0, topNode));
  while (null != (node = it.next())) {
    if (!isEmptyTextNode(node)) {
      rows.push(getRowText(it.getDepth() + 1, node));
    }
  }
  return rows.join('\n');
}


function findText(patternText, topNode) {
  var it = new NodeIterator(topNode || document);
  var regexp = new RegExp(patternText);
  var results = [];
  var node;
  while ((node = it.next()) != null) {
    if (node.nodeName == '#text' && node.textContent.match(regexp)) {
      var ancestors = it.getAncestors();
      results.push({
        node: node,
        text: node.textContent,
        ancestors: ancestors,
        stack: printNodes(ancestors)
      });
    }
  }
  return results;
}

function printNodes(a) {
  var t = [];
  for (var i=0; i < a.length; ++i) {
    t.push(nodeSnippet(a[i]));
  }
  return t.join('\n');
}
