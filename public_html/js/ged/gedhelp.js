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
  var help = this.msgs.help;
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

  h('<div id="gedHelpWrapper">');

  section(help.MOUSE_CONTROLS, [
      help.MOUSE_PAN,
      help.MOUSE_ZOOM
  ]);

  function kb(msg, combos) {
    var comboHtmls = [];
    for (var i = 0; i < combos.length; i++) {
      var combo = combos[i];
      var shift = combo.modifiers[plex.KeyModifier.SHIFT];
      var keyName = self.keys.getNameForKeyCode(combo.keyCode);
      comboHtmls.push(shift ? help.SHIFT_MODIFIER_FN(keyName) : keyName);
    }
    h(help.KEYBOARD_CONTROL_FN(comboHtmls, msg));
  }

  var allCombos = this.keyCombos.getAll();
  section(help.KEYBOARD_CONTROLS, [
      kb(help.SELECT, allCombos[GrafUi.Action.SELECT]),
      kb(help.UNSELECT, allCombos[GrafUi.Action.UNSELECT]),
      kb(help.ADD_SELECTIONS, allCombos[GrafUi.Action.ADD_SELECTIONS]),
      kb(help.SUBTRACT_SELECTIONS, allCombos[GrafUi.Action.SUBTRACT_SELECTIONS]),
      kb(help.DRAG, allCombos[GrafUi.Action.DRAG]),
      kb(help.LINK, allCombos[GrafUi.Action.LINK]),
      kb(help.DELETE, allCombos[GrafUi.Action.DELETE]),
      kb(help.COPY, allCombos[GrafUi.Action.COPY]),
      kb(help.PASTE, allCombos[GrafUi.Action.PASTE]),
      kb(help.UNDO, allCombos[GrafUi.Action.UNDO]),
      kb(help.REDO, allCombos[GrafUi.Action.REDO])
  ]);

  h('</div>');
  return html.join('');
};
