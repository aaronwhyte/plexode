// Copyright 2007 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview  Taking a stab at widgets here...
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.wij = plex.wij || {};
plex.wij.menu = {};

plex.wij.menu.C_ITEM = 'plexWijMenuItem';
plex.wij.menu.C_ITEM_HILITED = 'plexWijMenuItemHilited';

/**
 * @constructor
 */
plex.wij.Menu = function() {
  this.items = [];
  
  // very simple default renderers
  this.formatListFunc = function(itemHtmls) {
    return itemHtmls.join('');
  };
  this.formatItemFunc = function(item) {
    return plex.string.textToHtml(item);
  };
  
  this.hilitePs = new plex.PubSub();
  this.selectPs = new plex.PubSub();
  this.div = null;
  this.itemIds = [];
  this.hiliteIndex = -1;
};

/**
 * Subscribe to the 'hilite' publisher.
 * @param {Object} func
 */
plex.wij.Menu.prototype.subHilite = function(func) {
  this.hilitePs.subscribe(func);
};

/**
 * Unsubscribe from the 'hilite' publisher.
 * @param {Object} func
 */
plex.wij.Menu.prototype.unsubHilite = function(func) {
  this.hilitePs.unsubscribe(func);
};

/**
 * Subscribe to the 'select' publisher.
 * @param {Object} func
 */
plex.wij.Menu.prototype.subSelect = function(func) {
  this.selectPs.subscribe(func);
};

/**
 * Unsuscribe from the 'select' publisher.
 * @param {Object} func
 */
plex.wij.Menu.prototype.unsubSelect = function(func) {
  this.selectPs.unsubscribe(func);
};

/**
 * Lazy-creates div where all the menu content goes.  Use it to add CSS classes
 * and to position the menu, but please don't mess with the node innards.
 * @param {Object} opt_win  optional window obj used to create the div.  The
 *     default is the global context.
 * @return the div
 */
plex.wij.Menu.prototype.getDiv = function(opt_win) {
  var win = opt_win || window;
  if (!this.div) {
    var div = plex.dom.ce('div', null, win.document);
    plex.event.addListener(div, 'mouseover', this.getMousingFunc());
    plex.event.addListener(div, 'mouseout', this.getMousingFunc());
    plex.event.addListener(div, 'click', this.getSelectFunc());
    this.div = div;
  }
  return this.div;
};

/**
 * Sets the item list and writes new HTML into the div.  This nullifies the
 * hilite state.
 */
plex.wij.Menu.prototype.render = function(items, opt_win) {
  this.items = plex.array.copy(items);
  this.itemIds = plex.ids.nextIds(this.items.length);
  var html = this.format(this.itemIds);
  var div = this.getDiv(opt_win);
  div.innerHTML = html;
  this.setHiliteIndex(-1);
};

plex.wij.Menu.prototype.hiliteNext = function() {
  this.moveHiliteBy(1);
};

plex.wij.Menu.prototype.hilitePrev = function() {
  this.moveHiliteBy(-1);
};

plex.wij.Menu.prototype.selectHilited = function() {
  if (this.hiliteIndex >= 0) {
    this.selectPs.publish(this.hiliteIndex);
  }
};

////////////////////
// private methods
////////////////////

/**
 * Climbs up the DOM tree looking for an item node that belongs to the menu.
 * @param {Object} elem  some DOM element
 * @return {Object} an item DOM node, or null
 * @private
 */
plex.wij.Menu.prototype.getItemNodeByElement = function(elem) {
  var div = this.getDiv();
  while (elem) {
    if (elem == div) {
      return null;
    }
    try {
      if (elem.nodeName == 'TEXTAREA') {
        return null; // FF can't get ta.parentNode
      }
    } catch (e) {
      // Don't know why this happens yet.  FF 2, OS X.
      return null;
    }
    var id = elem.id;
    var num = plex.ids.getNum(id);
    if (num && plex.array.contains(this.itemIds, id)) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return null;
};

/**
 * @return {Function} the mouseover and mouseout callback
 * @private
 */
plex.wij.Menu.prototype.getMousingFunc = function() {
  return plex.func.bind(
      function(e) {
        e = e || window.event;
        var toElem = plex.event.getToElement(e);
        var toItem = this.getItemNodeByElement(toElem);
        var toIndex = -1;
        if (toItem) {
          toIndex = plex.array.indexOf(this.itemIds, toItem.id);
        }
        this.setHiliteIndex(toIndex);
      },
      this);
};

/**
 * @private
 */
plex.wij.Menu.prototype.getNodeByIndex = function(index) {
  if (index < 0 || index >= this.itemIds.length) return null;
  return plex.dom.gebi(this.itemIds[index]);
};

/**
 * @private
 */
plex.wij.Menu.prototype.setHiliteIndex = function(index) {
  if (index != this.hiliteIndex) {
    // unhilite old node if any
    var oldNode = this.getNodeByIndex(this.hiliteIndex);
    if (oldNode) {
      plex.dom.removeClass(oldNode, plex.wij.menu.C_ITEM_HILITED);
    }
    // update hiliteIndex
    this.hiliteIndex = index;
    // hilite new node if any
    var newNode = this.getNodeByIndex(index);
    if (newNode) {
      plex.dom.appendClass(newNode, plex.wij.menu.C_ITEM_HILITED);
    }
    this.hilitePs.publish(index);
  }
};

/**
 * @return {Function} the click callback
 * @private
 */
plex.wij.Menu.prototype.getSelectFunc = function() {
  return plex.func.bind(
      function(e) {
        e = e || window.event;
        var toElem = plex.event.getTarget(e);
        var toItem = this.getItemNodeByElement(toElem);
        var toIndex = -1;
        if (toItem) {
          toIndex = plex.array.indexOf(this.itemIds, toItem.id);
        }
        this.setHiliteIndex(toIndex);
        this.selectHilited();
      },
      this);
};

/**
 * Generates new HTML using IDs provided.
 * @param {Array.<String>} ids
 * @private
 */
plex.wij.Menu.prototype.format = function(ids) {
  var itemHtmls = [];
  for (var i = 0, n = this.items.length; i < n; ++i) {
    itemHtmls.push([
      '<div class="',plex.wij.menu.C_ITEM, '" id="', ids[i], '">',
      this.formatItemFunc(this.items[i]),
      '</div>'
    ].join(''));
  }
  return this.formatListFunc(itemHtmls);
};

/**
 * @private
 */
plex.wij.Menu.prototype.moveHiliteBy = function(diff) {
  if (!this.items.length) return;
  if (this.hiliteIndex == -1 && diff < 0) {
    // If we're starting with no hilite and going backwards, start at the top.
    this.hiliteIndex = this.items.length;
  }
  var index = this.hiliteIndex + diff;
  var length = this.items.length;
  while (index < 0) {
    index += length;
  }
  while (index >= length) {
    index -= length;
  }
  this.setHiliteIndex(index);
};
