// Copyright 2007 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview  pubsub for textarea content changes
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.wij = plex.wij || {};
plex.wij.tachanges = {};

/**
 * @constructor
 */
plex.wij.TaChanges = function(opt_elem) {
  this.changePs = new plex.PubSub();
  this.element = null;
  this.oldValue = null;
  this.changeFunc = this.getChangeFunc();
  if (opt_elem) {
    this.setElement(opt_elem);
  }
};

/**
 * Adds listeners to an input element, and keeps a pointer to the element.
 * Any listeners on a previous element are removed.  'Elem' may be null.
 * @param {Element} elem the textarea element
 */
plex.wij.TaChanges.prototype.setElement = function(elem) {
  var changeEvents = ['keyup', 'click', 'input', 'propertychange'];
  if (elem == this.element) return;
  if (this.element) {
    plex.event.removeListenerFromEvents(this.element, changeEvents, 
                                        this.changeFunc);
    this.oldValue = null;
  }
  if (elem) {
    this.element = elem;
    plex.event.addListenerToEvents(this.element, changeEvents, 
                                   this.changeFunc);
    this.oldValue = elem.value;
  }
};

/**
 * Subscribe to the 'change' publisher.
 * @param {Function} func  subscriber function, with the textarea value as an
 *     argument.
 */
plex.wij.TaChanges.prototype.subChange = function(func) {
  this.changePs.subscribe(func);
};

/**
 * Unsuscribe from the 'change' publisher.
 * @param {Function} func
 */
plex.wij.TaChanges.prototype.unsubChange = function(func) {
  this.changePs.unsubscribe(func);
};

////////////////////
// private methods
////////////////////
  
/**
 * @return {Function} an event handler that will publish to the chage PubSub if
 *     the text in the textarea has changed
 * @private
 */
plex.wij.TaChanges.prototype.getChangeFunc = function() {
  return plex.func.bind(
      function() {
        var newValue = this.element.value;
        if (newValue != this.oldValue) {
          this.oldValue = newValue;
          this.changePs.publish(newValue);
        }
      },
      this);
};