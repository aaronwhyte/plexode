// Copyright 2007 Aaron Whyte
// All Rights Reserved.

/**
 * @fileoverview  Autocomplete JS globals for plexode.com/eval.
 * Uses plex.js.*, and plex.wij.menu, plus whatever else I need to write
 * to support my first plexode autocomplete widgit.
 * @author Aaron Whyte
 */

this.plex = this.plex || {};
plex.wij = plex.wij || {};
plex.wij.jsac = {};

/**
 * @constructor
 */
plex.wij.JsAc = function() {
  this.acInput = null;
  this.menu = null;
  this.prefix = '';
  this.append = '';
  this.items = [];
  this.commandHandler = this.getCommandHandler();
  this.queryHandler = this.getQueryHandler();
  this.selectHandler = this.getSelectHandler();
};

/**
 * Unsubscribes from and existing AcInput, and subscribes to the new one, if
 * not null.
 * @param {plex.wij.AcInput} input  may be null
 */
plex.wij.JsAc.prototype.setAcInput = function(input) {
  if (this.acInput == input) return;
  if (this.acInput != null) {
    // unsubscribe the current handlers from the old AcInput
    this.acInput.unsubCommand(this.commandHandler);
    this.acInput.unsubQuery(this.queryHandler);
  }
  this.acInput = input;
  if (this.acInput != null) {
    // subscribe to the new AcInput
    this.acInput.subCommand(this.commandHandler);
    this.acInput.subQuery(this.queryHandler);
  }
};

plex.wij.JsAc.prototype.setMenu = function(menu) {
  if (this.menu == menu) return;
  if (this.menu != null) {
    // unsubscribe the current handlers from the old Menu
    this.menu.unsubSelect(this.selectHandler);
  }
  this.menu = menu;
  if (this.menu != null) {
    // subscribe to the new AcInput
    this.menu.subSelect(this.selectHandler);
  }
};

////////////////////
// private methods
////////////////////

plex.wij.JsAc.prototype.getCommandHandler = function() {
  return plex.func.bind(
      function(cmd) {
        var C = plex.wij.acinput.COMMANDS; 
        switch (cmd) {
          case C.DISMISS:
            this.dismiss();
            break;
          case C.SELECT:
            this.append = '';
            this.select();
            break;
          case C.RIGHT:
          case C.DOT:
            this.append = '.';
            this.select();
            break;
          case C.UP:
            this.prev();
            break;
          case C.DOWN:
            this.next();
            break;
        }
      },
      this);
};

plex.wij.JsAc.prototype.dismiss = function() {
  // TODO
};

plex.wij.JsAc.prototype.select = function() {
  this.menu.selectHilited();
};

plex.wij.JsAc.prototype.prev = function() {
  this.menu.hilitePrev();
};

plex.wij.JsAc.prototype.next = function() {
  this.menu.hiliteNext();
};

plex.wij.JsAc.prototype.getQueryHandler = function() {
  return plex.func.bind(
      function(q) {
        var completions = plex.js.props.getCompletions(window, q);
        this.prefix = completions.prefix;
        var matches = completions.matches;
        this.items.length = 0;
        for (name in matches) {
          // push items like {name:name, value:value}
          this.items.push({name:name, value:matches[name]});
        }
        this.menu.render(this.items);
        // hilite the first item by default
        this.menu.hiliteNext();
      },
      this);
};

plex.wij.JsAc.prototype.getSelectHandler = function() {
  return plex.func.bind(
      function(i) {
        this.acInput.replacePrefix(this.prefix,
                                   this.items[i].name + this.append);
      },
      this);
};

