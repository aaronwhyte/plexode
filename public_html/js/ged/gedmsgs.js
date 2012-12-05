GedMsgs = {
  help: {
    HELP: 'help',
    MOUSE_CONTROLS: 'mouse',
    MOUSE_PAN: '<span class="getHelpMouseControl">Pan</span> by dragging the canvas, while holding the mouse button down.',
    MOUSE_ZOOM: '<span class="getHelpMouseControl">Zoom</span> by scrolling with the mousewheel, or using the two-finger trackpad up/down gesture, or whatevs.',

    KEYBOARD_CONTROLS: 'keyboard',
    KEYBOARD_CONTROL_FN: function(keyCombos, desc) {return keyCombos.join(' or ') + ': ' + desc;},
    SHIFT_MODIFIER_FN: function(keyName) {return 'shift + ' + keyName;},

    SELECT: 'Select. Hold the key down and move the pointer to create a selection box, ' +
        'and release the key to select all the highlighted parts and jacks. ' +
        'Or just tap the key to select whatever you are pointing at. '+
        'The editor remembers your previous selections, which is strange but powerful.' +
        '<br>Nerds: It\'s selections.push()',
    UNSELECT: 'Unselect. The current selection is forgotten, ' +
        'and the previous selection becomes the current one. ' +
        '<br>Nerds: That\'s selections.pop()',
    ADD_SELECTIONS: 'Add the current selection to the previous selection. ' +
        '<br>My people: Think push(add(pop(), pop())',
    SUBTRACT_SELECTIONS: 'Subtract the current selection from the previous selection. ' +
        '<br>You know, push(subtract(pop(), pop())',

    DRAG: 'Drag the selected parts by holding the key down and moving the pointer.',
    LINK: 'Link any input and output jacks in the current selection. ' +
        'Input jacks are on top of parts. Output jacks are on the bottom.',
    DELETE: 'Delete parts in the current selection, or delete links to selected jacks.',

    COPY: 'Copy the current selection to clipboard.',
    PASTE: 'Paste. Hold the key down and move the pointer to position the clip, ' +
        'and release the key to drop the clip in place.',

    UNDO: 'Undo',
    REDO: 'Redo',

    $:''
  }
};
