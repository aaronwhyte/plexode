// Copyright 2007 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview  Autocomplete Input adapter.  This is an adapter that provides
 * an interface to a textarea that is useful for an autocomplete widget.
 * <p>
 * It has a 'command' pubsub, for key commands like next, prev, select, and
 * dismiss.
 * <p>
 * It also has a 'query' pubsub, which fires when the text
 * left of the cursor changes, either by editing, or by moving the cursor.
 * <p>
 * There are a couple methods for getting the text left of the cursor, and
 * for injecting autocompleted text into the input element.
 * <p>
 * There is no format function, and this isn't a widget itself.  It is just
 * a bridge between an existing input element and an autocomplete widget.
 * 
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.wij = plex.wij || {};
plex.wij.acinput = {};

plex.wij.acinput.COMMANDS = {
  DISMISS: 1,
  SELECT: 2,
  DOT: 3,
  UP: 4,
  DOWN: 5,
  LEFT: 6,
  RIGHT: 7
};

/**
 * @constructor
 */
plex.wij.AcInput = function() {
  this.commandPs = new plex.PubSub();
  this.queryPs = new plex.PubSub();
  /** the input element */
  this.element = null;
  /** the text to the left of the cursor */
  this.value = "";
  
  this.commandFunc = this.getCommandFunc();
  this.queryFunc = this.getQueryFunc();
  
  // workaround Safari 2.0.4 bug where arrow-keys trigger double events
  this.lastCommandTime = -1;
  this.lastCommand = -1;
};

/**
 * Adds listeners to an input element, and keeps a pointer to the element.
 * Any listeners on a previous element are removed.  'Elem' may be null.
 * @param {Object} elem  the input element
 */
plex.wij.AcInput.prototype.setElement = function(elem) {
  var queryEvents = ['keyup', 'click', 'input', 'propertychange'];
  var commandEvents = ['keydown', 'xkeypress'];
  if (elem == this.element) return;
  if (this.element) {
    plex.event.removeListenerFromEvents(this.element, queryEvents, 
                                        this.queryFunc);
    plex.event.removeListenerFromEvents(this.element, commandEvents, 
                                        this.commandFunc);
  }
  if (elem) {
    this.element = elem;
    plex.event.addListenerToEvents(this.element, queryEvents, 
                                   this.queryFunc);
    plex.event.addListenerToEvents(this.element, commandEvents, 
                                   this.commandFunc);
  }
};

/**
 * Inserts text at the cursor, replacing the current selection, and moving
 * the cursor to be after the inserted text.
 * @param {String} text
 */
plex.wij.AcInput.prototype.replacePrefix = function(prefix, text) {
  plex.textarea.replacePrefix(this.element, prefix, text);
  this.queryFunc();
};

/**
 * Subscribe to the 'command' publisher.
 * @param {Function} func  subscriber function.  It will be called with one
 *     argument: the command being issued.
 */
plex.wij.AcInput.prototype.subCommand = function(func) {
  this.commandPs.subscribe(func);
};

/**
 * Unsubscribe from the 'command' publisher.
 * @param {Object} func
 */
plex.wij.AcInput.prototype.unsubCommand = function(func) {
  this.commandPs.unsubscribe(func);
};

/**
 * Subscribe to the 'query' publisher.
 * @param {Object} func  subscriber function, with no arguments.  To get the
 *     query, use getQuery().
 */
plex.wij.AcInput.prototype.subQuery = function(func) {
  this.queryPs.subscribe(func);
};

/**
 * Unsuscribe from the 'query' publisher.
 * @param {Object} func
 */
plex.wij.AcInput.prototype.unsubQuery = function(func) {
  this.queryPs.unsubscribe(func);
};

////////////////////
// private methods
////////////////////
  
/**
 * @return {Function} an event handler that will publish to the query PubSub if
 *     the text to the left of the cursor has changed
 * @private
 */
plex.wij.AcInput.prototype.getQueryFunc = function() {
  return plex.func.bind(
      function() {
        // ignores the event; just uses the selection and the value
        var ta = this.element;
        var cursorPos = plex.textarea.getSelection(ta).start;
        var newVal = this.element.value.substr(0, cursorPos);
        if (newVal != this.value) {
          this.value = newVal;
          this.queryPs.publish(newVal);
        }
      },
      this);
};

/**
 * Listens to key events for autocomplete-related commands and publishes them
 * on the 'command' pubsub.
 * <ul>
 * <li>escape: DISMISS
 * <li>ctrl-up: PREV
 * <li>ctrl-down: NEXT
 * <li>ctrl-enter: SELECT
 * </ul>
 * @return {Function} an event handler that will publish to the command PubSub
 *     if the keypress triggers one of the commands
 * @private
 */
plex.wij.AcInput.prototype.getCommandFunc = function() {
  return plex.func.bind(
      function(e) {
        var e = e || window.event;
        var command = null;
        var C = plex.wij.acinput.COMMANDS;
        var K = plex.event.KEYCODES;
        var code = e.which || e.keyCode;
	//log(plex.object.expose(e));
        if (code == plex.event.KEYCODES.ESC) {
          command = C.DISMISS;
        } else if (e.ctrlKey) {
          switch (code) {
            case K.ENTER:
            case K.RETURN:
              command = C.SELECT;
              break;
            case K.DOT:
              command = C.DOT;
              break;
            case K.UP:
            case K.UP_SAFARI:
              command = C.UP;
              break;
            case K.DOWN:
            case K.DOWN_SAFARI:
              command = C.DOWN;
              break;
            case K.LEFT:
            case K.LEFT_SAFARI:
              command = C.LEFT;
              break;
            case K.RIGHT:
            case K.RIGHT_SAFARI:
              command = C.RIGHT;
              break;
          }
        }
        if (command) {
          var now = plex.time.now();
          if (now - this.lastCommandTime > 20 ||
              command != this.lastCommand) {
            this.lastCommand = command;
            this.lastCommandTime = now;
            this.commandPs.publish(command);
          }
          // cancel default action
          plex.event.preventDefault(e);
          return false;
        }
      },
      this);
};
