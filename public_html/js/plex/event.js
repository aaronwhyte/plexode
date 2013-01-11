// Copyright 2006 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview Code for handling DOM events in a cross-browser way.
 */
this.plex = this.plex || {};
plex.event = {};

/**
 * keycodes for key event.keyCode
 */
plex.event.KEYCODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  UP_SAFARI: 63232,
  DOWN_SAFARI: 63233,
  LEFT_SAFARI: 63234,
  RIGHT_SAFARI: 63235,
  ENTER: 77,
  RETURN: 13,
  ESC: 27,
  DOT: 46,
  SPACE: 32,
  C: 67,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  P: 80,
  S: 83,
  X: 88,
  Z: 90,
  BACKSLASH: 220
};

/**
 * Adds an event listener.
 * @param {object} element  DOM element to which to attach listener
 * @param {string} eventName  like 'click', without the 'on' part
 * @param {function} fn  listener function to add
 */
plex.event.addListener = function(element, eventName, fn) {
  if (element.addEventListener) {
    // DOM Level 2
    element.addEventListener(eventName, fn, false);
  } else if (element.attachEvent) {
    // IE
    element.attachEvent('on' + eventName, fn);
  }
};


/**
 * Adds a listener to multiple events.
 * @param {object} element  DOM element to which to attach listener
 * @param {array.<string>} eventNames  like 'click', without the 'on' part
 * @param {function} fn  listener function to add
 */
plex.event.addListenerToEvents = function(element, eventNames, fn) {
  for (var i = 0; i < eventNames.length; ++i) {
    plex.event.addListener(element, eventNames[i], fn);
  }
};


/**
 * Removes an event listener.
 * @param {object} element  DOM element from which to remove listener
 * @param {string} eventName  like 'click', without the 'on' part
 * @param {function} fn  listener function to remove
 */
plex.event.removeListener = function(element, eventName, fn) {
  if (element.removeEventListener) {
    // DOM level 2
    element.removeEventListener(eventName, fn, false);
  } else if (element['detatchEvent']) {
    // IE
    element['detatchEvent']('on' + eventName, fn);
  }
};


/**
 * Removes an event listener from multiple events.
 * @param {object} element  DOM element from which to remove listener
 * @param {array.<string>} eventNames  like 'click', without the 'on' part
 * @param {function} fn  listener function to remove
 */
plex.event.removeListenerFromEvents = function(element, eventNames, fn) {
  for (var i = 0; i < eventNames.length; ++i) {
    plex.event.removeListener(element, eventNames[i], fn);
  }
};


/**
 * Gets the event target from an event object.
 * @param {object} event
 */
plex.event.getTarget = function(event) {
  return event.target || event.srcElement;
};


/**
 * Gets the related target for a mouseover/mouseout event.
 * @param {object} event  must not be null
 * @return {object} element or null
 */
plex.event.getRelatedTarget = function(event) {
  // Other
  if (event.relatedTarget) return event.relatedTarget;
  // IE
  switch(event.type) {
    case 'mouseover': return event.fromElement;
    case 'mouseout': return event.toElement;
  }
  return null;
};


/**
 * For mouseover/mouseout, returns the element that the mouse left.
 * May return null when the mouse is entering from off-window.
 * @param {object} event  must not be null
 * @return {object} element or null
 */
plex.event.getFromElement = function(event) {
  // IE
  if (event.fromElement) return event.fromElement;
  // Other
  switch(event.type) {
    case 'mouseover': return event.relatedTarget;
    case 'mouseout': return event.target;
  }
  return null;
};


/**
 * For mouseover/mouseout, returns the element that the mouse entered.
 * May return null when the mouse is leaving the window.
 * @param {object} event  must not be null
 * @return {object} element or null
 */
plex.event.getToElement = function(event) {
  // IE
  if (event.toElement) return event.toElement;
  // Other
  switch(event.type) {
    case 'mouseover': return event.target;
    case 'mouseout': return event.relatedTarget;
  }
  return null;
};


plex.event.preventDefault = function(event) {
  if ('preventDefault' in event) {
    // DOM2
    event.preventDefault();
  }
  if ('returnValue' in event) {
    event.returnValue = false;
  }
  if ('cancelBubble' in event) {
    event.cancelBubble = true;
  }
};

plex.event.isRightClick = function(mouseClickEvent) {
  // see http://www.quirksmode.org/js/events_properties.html#button
  return mouseClickEvent.button == 2;
};

/**
 * Tracks listeners so unlistening can be done easily.
 * @constructor
 */
plex.event.ListenerTracker = function() {
  this.listeners = [];
};

plex.event.ListenerTracker.prototype.addListener = function(element, eventName, fn) {
  plex.event.addListener(element, eventName, fn);
  this.listeners.push([element, eventName, fn]);
};

plex.event.ListenerTracker.prototype.removeAllListeners = function() {
  var a;
  while (a = this.listeners.pop()) {
    plex.event.removeListener(a[0], a[1], a[2]);
  }
};
