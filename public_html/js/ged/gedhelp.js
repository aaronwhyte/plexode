/**
 * Help widget
 * @param {GedMsgs} msgs
 * @param {plex.Keys} keys
 * @param {GrafUiKeyCombos} keyCombos
 * @constructor
 */
function GedHelp(msgs, keys, keyCombos) {
  this.msgs = msgs;
  this.keys = keys;
  this.keyCombos = keyCombos;
}

/**
 * @return {string}
 */
GedHelp.prototype.formatHtml = function() {
  var self = this;
  var helpMsgs = this.msgs.help;
  var html = [];

  function h() {
    html.push.apply(html, arguments);
  }

  function section(title, items) {
    h('<h1 class="gedHelpTitle">', title, '</h1>');
    h('<ul class="gedHelpList">');
    for (var i = 0; i < items.length; i++) {
      h('<li class="gedHelpListItem">', items[i], '</li>');
    }
    h('</ul>');
  }

  section(helpMsgs.MOUSE_CONTROLS, [
    helpMsgs.MOUSE_PAN,
    helpMsgs.MOUSE_ZOOM
  ]);

  function kb(msg, combos) {
    var comboHtmls = [];
    for (var i = 0; i < combos.length; i++) {
      var combo = combos[i];
      var shift = plex.array.contains(combo.modifiers, plex.KeyModifier.SHIFT);
      var keyName = self.keys.getNameForKeyCode(combo.keyCode);
      comboHtmls.push(
          '<span class="gedHelpKeyCombo">' +
          (shift ? helpMsgs.SHIFT_MODIFIER_FN(keyName) : keyName) +
          '</span>'
      );
    }
    return helpMsgs.KEYBOARD_CONTROL_FN(comboHtmls, msg);
  }

  var allCombos = this.keyCombos.getAll();
  section(helpMsgs.KEYBOARD_CONTROLS, [
      kb(helpMsgs.SELECT, allCombos[GrafUi.Action.SELECT]),
      kb(helpMsgs.UNSELECT, allCombos[GrafUi.Action.UNSELECT]),
      kb(helpMsgs.ADD_SELECTIONS, allCombos[GrafUi.Action.ADD_SELECTIONS]),
      kb(helpMsgs.SUBTRACT_SELECTIONS, allCombos[GrafUi.Action.SUBTRACT_SELECTIONS]),
      kb(helpMsgs.DRAG_SELECTION, allCombos[GrafUi.Action.DRAG_SELECTION]),
      kb(helpMsgs.LINK, allCombos[GrafUi.Action.LINK]),
      kb(helpMsgs.DELETE, allCombos[GrafUi.Action.DELETE]),
      kb(helpMsgs.COPY, allCombos[GrafUi.Action.COPY]),
      kb(helpMsgs.PASTE, allCombos[GrafUi.Action.PASTE]),
      kb(helpMsgs.UNDO, allCombos[GrafUi.Action.UNDO]),
      kb(helpMsgs.REDO, allCombos[GrafUi.Action.REDO])
  ]);

  return html.join('');
};
