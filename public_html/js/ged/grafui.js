/**
 * Converts user gestures to GrafStor actions.
 * Maintains UI mode
 * - dragging, linking, editing field, etc.
 * - clipboard (set by app code)
 * - (but selection is really backed by GrafStor's GrafEd).
 *
 * Mutations
 * - Mutates the GrafStor using its high-level action support.
 *
 * Cameraman
 * - pan and zoom
 * - translates gestures into world coords
 *
 * Does the rendering.
 * - Owns the pluggable underlayer, and controls its camera,
 *   state invalidation (retransformation), and rendering calls.
 * - Overlays the graf rendering stuff on top.
 * - Handles key/value input widgets.
 *
 *
 * @param {GrafEd} grafEd for editing
 * @param {Renderer} renderer for muching with the camera and measuring the canvas
 * @param {GrafRend} grafRend for uuuuh
 * @param {GrafGeom} grafGeom
 * @param plugin app-specific thing with invalidate() and render(model)
 * @param {Clipboard} clipboard
 * @param {ClipMenu} clipMenu
 * @param {GrafUiKeyCombos} keyCombos
 * @constructor
 */
function GrafUi(grafEd, renderer, grafRend, grafGeom, plugin, clipboard, clipMenu, keyCombos) {
  this.grafEd = grafEd;
  this.renderer = renderer;
  this.grafRend = grafRend;
  this.grafGeom = grafGeom;
  this.plugin = plugin;
  this.clipboard = clipboard;
  this.clipMenu = clipMenu;
  this.keyCombos = keyCombos;

  this.viewDirty = true;
  this.pointerWorldPosChanged = true;
  this.mode = GrafUi.Mode.DEFAULT;

  this.loop = null;
  this.canvasPos = null;
  this.worldPos = new Vec2d();
  this.deltaZoom = 0;
  this.panning = false;

  this.contentsFramed = false;

  this.snap = GrafUi.MIN_SNAP;
}

GrafUi.FPS = 30;

GrafUi.MAX_ZOOM = 50;
GrafUi.MIN_ZOOM = 0.01;

GrafUi.MIN_SNAP = 8;
GrafUi.MAX_SNAP = 256;

GrafUi.HOVER_COLOR = 'rgba(255, 255, 255, 0.5)';
GrafUi.HILITE_COLOR = 'rgba(255, 255, 255, 0.9)';

GrafUi.SELECTION_RENDER_PADDING = 2;

GrafUi.SELECTION_COLORS = [
  'rgba(0, 255, 100, 0.95)',
  'rgba(220, 180, 0, 0.85)',
  'rgba(210, 100, 0, 0.5)',
  'rgba(200, 40, 0, 0.2)'
];

GrafUi.MODEL_LINE_WIDTH = 1.5;
GrafUi.SELECTION_LINE_WIDTH = 1.5;
GrafUi.HILITE_LINE_WIDTH = 1.5;

/**
 * Quasimodes the user can be in by holding a key.
 * @enum {String}
 */
GrafUi.Mode = {
  DEFAULT: 'default',
  DRAG_PART: 'drag_part',
  DRAG_JACK: 'drag_jack',
  DRAG_SELECTION: 'drag_sel',
  PASTE: 'paste',
  SELECT: 'select',
  EDIT_DATA: 'edit_data'
};

/**
 * Names of the actions the user can in the grafui.
 * @enum {string}
 */
GrafUi.Action = {
  GRID_SNAP: 'grid_snap',

  SELECT: 'select',
  UNSELECT: 'unselect',
  ADD_SELECTIONS: 'add_selections',
  SUBTRACT_SELECTIONS: 'subtract_selections',

  COPY: 'copy',
  PASTE: 'paste',
  DELETE: 'delete',

  LINK: 'link',

  UNDO: 'undo',
  REDO: 'redo',

  TOGGLE_CLIP_MENU: 'toggle_clip_menu'
};

GrafUi.prototype.startLoop = function() {
  this.grafEd.setCallback(this.getGrafEdInvalidationCallback());
  this.resize();
  this.clipboard.start();
  this.clipMenu.setOnSelect(this.getSelectClipMenuItemFn());
  this.clipMenu.render();

  if (!this.contentsFramed) {
    this.grafRend.frameContents(0.66);
    this.contentsFramed = true;
  }
  if (!this.listeners) {
    this.listeners = new plex.event.ListenerTracker();
    this.listeners.addListener(document, 'mousemove', this.getMouseMoveListener());

    this.listeners.addListener(this.renderer.canvas, 'mousedown', this.getMouseDownListener());
    this.listeners.addListener(document, 'mouseup', this.getMouseUpListener());

    this.listeners.addListener(this.renderer.canvas, 'mousewheel', this.getMouseWheelListener());
    this.listeners.addListener(this.renderer.canvas, 'DOMMouseScroll', this.getMouseWheelListener());
    this.listeners.addListener(this.renderer.canvas, 'wheel', this.getMouseWheelListener());

    this.listeners.addListener(document, 'keydown', this.getKeyDownListener());
    this.listeners.addListener(document, 'keyup', this.getKeyUpListener());

    this.listeners.addListener(window, 'resize', this.getResizeListener());
  }
  if (!this.loop) {
    var self = this;
    this.loop = new plex.Loop(
        function() {
          self.clock();
        },
        GrafUi.FPS);
  }
  this.loop.start();
};

GrafUi.prototype.stopLoop = function() {
  this.clipboard.stop();
  this.stopEditingData();
  if (this.listeners) {
    this.listeners.removeAllListeners();
    this.listeners = null;
  }
  if (this.loop) {
    this.loop.stop();
  }
  this.grafEd.unsubscribe();
};

GrafUi.prototype.setSnap = function(snap) {
  this.snap = snap;
};

GrafUi.prototype.getSelectClipMenuItemFn = function() {
  var self = this;
  return function(clip) {
    self.clipboard.setModel(clip.getModel());
    self.clipMenu.hide();
  };
};

GrafUi.prototype.getGrafEdInvalidationCallback = function() {
  var self = this;
  return function() {
    self.viewDirty = true;
    self.plugin.invalidate();
  };
};

GrafUi.prototype.getMouseMoveListener = function() {
  // Because there can be lots of mousemoves between frames,
  // defer handling moves until clock().
  var self = this;
  return function(event) {
    self.viewDirty = true;
    if (!self.panning) {
      self.pointerWorldPosChanged = true;
    }
    // Else we are mouse-panning, so the pointer's world pos remains the same,
    // even though the pointer's position on the viewport canvas changed.

    event = event || window.event;
    self.setCanvasPosWithEvent(event);
  };
};

GrafUi.prototype.getMouseDownListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    event = event || window.event;
    var worldPos = self.getWorldPosOfCanvasPos();
    var id = self.grafGeom.getIdAtVec(worldPos);
    var editId = self.grafGeom.getNearestEditButtonPartId(worldPos);
    var inDefaultMode = self.mode == GrafUi.Mode.DEFAULT;
//    if (inDefaultMode && event.shiftKey) {
//      self.startSelection();
//    }
    if (id == null && editId == null) {
      self.panning = true;
      self.setCanvasPosWithEvent(event);
    } else if (inDefaultMode && editId) {
      self.startEditingData(editId);
    } else if (inDefaultMode && self.grafEd.getJack(id)) {
      self.startDraggingJack(id);
    } else if (inDefaultMode && self.grafEd.isSelected(id)) {
      self.startDraggingSelection();
    } else if (inDefaultMode && self.grafEd.getPart(id)) {
      self.startDraggingPart(id);
    }
  };
};

GrafUi.prototype.getMouseUpListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    event = event || window.event;
    self.panning = false;
    self.setCanvasPosWithEvent(event);

//    if (self.mode == GrafUi.Mode.SELECT) {
//      self.endSelection();
//    }
    if (self.mode == GrafUi.Mode.DRAG_SELECTION) {
      self.endDraggingSelection();
    } else if (self.mode == GrafUi.Mode.DRAG_PART) {
      self.endDraggingPart();
    } else if (self.mode == GrafUi.Mode.DRAG_JACK) {
      self.endDraggingJack();
    }
  };
};

GrafUi.prototype.getMouseWheelListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    event = event || window.event;
    if ('wheelDeltaY' in event) {
      self.deltaZoom += event['wheelDeltaY'];
    } else if ('deltaY' in event) {
      self.deltaZoom += event['deltaY'];
    } else if ('detail' in event) {
      // Mozilla
      self.deltaZoom += event['detail'] * -30;
    }
    self.setCanvasPosWithEvent(event);
    event.preventDefault();
    return false;
  };
};

GrafUi.prototype.getKeyDownListener = function() {
  var self = this;
  return function(event) {
    // Don't act on keypresses if we're using the keyboard for data editing.
    if (self.mode == GrafUi.Mode.EDIT_DATA) return;

    event = event || window.event;

    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.GRID_SNAP)) {
      self.snap *= 2;
      if (self.snap > GrafUi.MAX_SNAP) {
        self.snap = GrafUi.MIN_SNAP;
      }
    }

    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.ADD_SELECTIONS)) {
      self.viewDirty = true;
      self.grafEd.addSelections();
    }
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.SUBTRACT_SELECTIONS)) {
      self.viewDirty = true;
      self.grafEd.subtractSelections();
    }

    // delete
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.DELETE)) {
      self.viewDirty = true;
      self.plugin.invalidate();
      self.grafEd.deleteSelection();
      // don't do browser "back" navigation
      event.preventDefault();
    }

    // link
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.LINK)) {
      self.viewDirty = true;
      self.plugin.invalidate();
      self.grafEd.linkSelectedJacks();
    }

    // copy
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.COPY)) {
      self.copy();
    }

    // undo/redo
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.UNDO)) {
      self.viewDirty = true;
      self.plugin.invalidate();
      self.grafEd.undo();
    }
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.REDO)) {
      self.viewDirty = true;
      self.plugin.invalidate();
      self.grafEd.redo();
    }

    // toggle menu
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.TOGGLE_CLIP_MENU)) {
      self.clipMenu.toggle();
    }

    // unselect
    if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.UNSELECT)) {
      self.viewDirty = true;
      self.grafEd.popSelection();
    }
    // Mouse-motion quasimodes only work once we know where the mouse is.
    // Only allow one quasimode at a time.
    if (self.canvasPos && self.mode == GrafUi.Mode.DEFAULT) {

      // select pseudomode, or undo (pop) selection
      if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.SELECT)) {
        self.startSelection();
      }

      // paste pseudomode
      if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.PASTE)) {
        var pasteModel = self.clipboard.getModel();
        if (pasteModel) {
          self.mode = GrafUi.Mode.PASTE;
          self.grafEd.startPasteVec(pasteModel, self.worldPos);
          self.viewDirty = true;
          self.plugin.invalidate();
        }
      }
    }
  };
};

GrafUi.prototype.getKeyUpListener = function() {
  var self = this;
  return function(event) {
    // Don't act on keypresses if we're using the keyboard for data editing.
    if (self.mode == GrafUi.Mode.EDIT_DATA) return;

    event = event || window.event;
    if (self.mode == GrafUi.Mode.PASTE &&
        self.keyCombos.eventMatchesAction(event, GrafUi.Action.PASTE)) {
      self.grafEd.continuePasteVec(self.worldPos, self.snap);
      self.grafEd.endPaste(false);
      self.viewDirty = true;
      self.mode = GrafUi.Mode.DEFAULT;
    }
    if (self.mode == GrafUi.Mode.SELECT &&
        self.keyCombos.eventMatchesAction(event, GrafUi.Action.SELECT)) {
      self.endSelection();
    }
  };
};


GrafUi.prototype.startEditingData = function(objId) {
  this.editingId = objId;
  this.mode = GrafUi.Mode.EDIT_DATA;
  var obj = this.grafEd.getModel().getObj(objId);

  // create a little form I guess?
  this.editDiv = plex.dom.ce('div', document.body);
  this.editDiv.className = 'gedEditForm';

  var first = true;
  for (var key in obj.data) {
    var field = plex.dom.ce('div', this.editDiv);
    field.classList.add('gedEditField');

    var labelElem = plex.dom.ce('label', field);
    labelElem.classList.add('gedEditLabel');
    plex.dom.ct(key + ':', labelElem);

    var val = obj.data[key];
    var inputElem = plex.dom.ce('input', field);
    inputElem.classList.add('gedEditInput');
    inputElem.value = val;
    inputElem.id = 'editdata_' + key;
    if (first) {
      window.setTimeout(function(){inputElem.focus()}, 0);
    }
    first = false;
  }
  var button = plex.dom.ce('button', this.editDiv);
  button.classList.add('gedEditButton');
  plex.dom.ct('Save & Close', button);
  button.onclick = this.getEditingOkFn();
};

GrafUi.prototype.getEditingOkFn = function() {
  var self = this;
  return function() {
    self.saveEditingData();
    self.stopEditingData();
  };
};

/**
 * Saves the data in the little object data form, if any
 */
GrafUi.prototype.saveEditingData = function() {
  if (!this.editDiv) return;
  var obj = this.grafEd.getModel().objs[this.editingId];
  var inputs = document.querySelectorAll('.gedEditInput');
  if (obj && inputs.length) {
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var key = input.id.split('_')[1];
      var val = input.value;
      var changes = {};
      if (key && key in obj.data && obj.data[key] != val) {
        changes[key] = input.value;
      }
    }
    if (!plex.object.isEmpty(changes)) {
      this.grafEd.editObjData(this.editingId, changes);
    }
  }
};

GrafUi.prototype.stopEditingData = function() {
  if (this.editDiv) {
    this.editDiv.innerHTML = '';
    document.body.removeChild(this.editDiv);
    this.editDiv = null;
  }
  this.editingId = null;
  this.mode = GrafUi.Mode.DEFAULT;
};

GrafUi.prototype.startSelection = function() {
  this.viewDirty = true;
  this.mode = GrafUi.Mode.SELECT;
  this.grafEd.startSelectionVec(this.worldPos);
};

GrafUi.prototype.endSelection = function() {
  this.grafEd.continueSelectionVec(this.worldPos);
  this.grafEd.endSelection();
  this.viewDirty = true;
  this.mode = GrafUi.Mode.DEFAULT;
};


GrafUi.prototype.startDraggingSelection = function() {
  this.mode = GrafUi.Mode.DRAG_SELECTION;
  this.grafEd.startDraggingSelectionVec(this.worldPos);
};

GrafUi.prototype.endDraggingSelection = function() {
  this.grafEd.continueDraggingSelectionVec(this.worldPos, this.snap);
  this.grafEd.endDraggingSelection();
  this.viewDirty = true;
  this.mode = GrafUi.Mode.DEFAULT;
};


/**
 * Start dragging a previously unselected part.
 * Creates a temporary selection.
 * @param partId
 */
GrafUi.prototype.startDraggingPart = function(partId) {
  //this.grafEd.createSelectionWithId(partId);
  this.mode = GrafUi.Mode.DRAG_PART;
  this.grafEd.startDraggingPartVec(partId, this.worldPos);
};

GrafUi.prototype.endDraggingPart = function() {
  this.grafEd.continueDraggingPartVec(this.worldPos, this.snap);
  this.grafEd.endDraggingPart();
  //this.grafEd.popSelection();
  this.viewDirty = true;
  this.mode = GrafUi.Mode.DEFAULT;
};

/**
 * Start to drag any jack, to form a link between two jacks.
 * Creates a temporary selection.
 * @param jackId
 */
GrafUi.prototype.startDraggingJack = function(jackId) {
  this.mode = GrafUi.Mode.DRAG_JACK;
  this.grafEd.startDraggingJack(jackId, this.worldPos);
};

GrafUi.prototype.endDraggingJack = function() {
  this.grafEd.continueDraggingJackVec(this.worldPos);
  this.grafEd.endDraggingJack();
  this.viewDirty = true;
  this.mode = GrafUi.Mode.DEFAULT;
};


GrafUi.prototype.getResizeListener = function() {
  var self = this;
  return function(event) {
    self.resize();
  };
};

GrafUi.prototype.resize = function() {
  var s = plex.window.getSize();
  this.renderer.setCanvasWidthHeight(s.width, s.height);
  this.viewDirty = true;
};

GrafUi.prototype.copy = function() {
  var model = this.grafEd.copySelectedModel();
  if (model) {
    this.clipboard.setModel(model);
  }
};

GrafUi.prototype.setCanvasPosWithEvent = function(event) {
  var target = plex.event.getTarget(event);
  if (!this.canvasPos) this.canvasPos = new Vec2d();
  this.canvasPos.setXY(
      event.pageX - this.renderer.getCanvasPageX(),
      event.pageY - this.renderer.getCanvasPageY());
};

GrafUi.prototype.getWorldPosOfCanvasPos = function() {
  return (new Vec2d())
      .set(this.canvasPos)
      .addXY(-this.renderer.getCanvasWidth() / 2, -this.renderer.getCanvasHeight() / 2)
      .scale(1 / this.renderer.getZoom())
      .add(this.renderer.getPan());
};

GrafUi.prototype.setWorldPos = function(pos) {
  this.worldPos.set(pos);
};

GrafUi.prototype.clock = function() {

  if (this.pointerWorldPosChanged && this.canvasPos) {
    this.setWorldPos(this.getWorldPosOfCanvasPos());
    this.pointerWorldPosChanged = false;
  }
  if (this.mode == GrafUi.Mode.SELECT) {
    this.grafEd.continueSelectionVec(this.worldPos);
  } else if (this.mode == GrafUi.Mode.DRAG_SELECTION) {
    this.grafEd.continueDraggingSelectionVec(this.worldPos, this.snap);
    this.plugin.invalidate();
  } else if (this.mode == GrafUi.Mode.DRAG_PART) {
    this.grafEd.continueDraggingPartVec(this.worldPos, this.snap);
    this.plugin.invalidate();
  } else if (this.mode == GrafUi.Mode.DRAG_JACK) {
    this.grafEd.continueDraggingJackVec(this.worldPos);
    this.plugin.invalidate();
  } else if (this.mode == GrafUi.Mode.PASTE) {
    this.grafEd.continuePasteVec(this.worldPos, this.snap);
    this.plugin.invalidate();
  }

  // Zooming
  if (this.deltaZoom) {
    this.viewDirty = true;
    this.renderer.scaleZoom(Math.exp(this.deltaZoom/2000));
    var z = this.renderer.getZoom();
    if (z < GrafUi.MIN_ZOOM) this.renderer.setZoom(GrafUi.MIN_ZOOM);
    if (z > GrafUi.MAX_ZOOM) this.renderer.setZoom(GrafUi.MAX_ZOOM);
    this.deltaZoom = 0;
  }

  if (this.canvasPos) {
    // If the the pointer's screen position doesn't match the pointer's world position,
    // then this will pan the canvas to adjust.
    // This is the mechanism that makes the pointer stick to the world perfectly while zooming,
    // and it's the way the view gets scrolled when panning.
    var worldPosOfCanvasPos = this.getWorldPosOfCanvasPos();
    var panCorrection = worldPosOfCanvasPos.subtract(this.worldPos).scale(-1);
    this.renderer.addPan(panCorrection);
  }
  this.draw();
};

GrafUi.prototype.draw = function() {
  if (!this.viewDirty) return;

  this.grafRend.draw();

  this.renderer.transformStart();

  // selections
  var selectionsSize = this.grafEd.getSelectionsSize();
  var alpha = 0.9;
  this.renderer.context.lineWidth = GrafUi.SELECTION_LINE_WIDTH / this.renderer.getZoom();
  for (var i = 0; i < Math.min(selectionsSize, GrafUi.SELECTION_COLORS.length); i++) {
    this.renderer.setStrokeStyle(GrafUi.SELECTION_COLORS[i]);
    var selIds = this.grafEd.getSelectedIds(i);
    for (var s = 0; s < selIds.length; s++) {
      var id = selIds[s];
      var selPos = this.grafGeom.getPosById(id);
      if (!selPos) continue;
      var selRad = this.grafGeom.getRadById(id);
      selRad += (GrafUi.SELECTION_COLORS.length - i) *
          GrafUi.SELECTION_RENDER_PADDING / this.renderer.getZoom();
      this.renderer.strokeCirclePosXYRad(selPos.x, selPos.y, selRad);
    }
    alpha *= 0.75;
  }

  // hilite
  this.renderer.setStrokeStyle(GrafUi.HILITE_COLOR);
  this.renderer.context.lineWidth = GrafUi.HILITE_LINE_WIDTH / this.renderer.getZoom();
  var hiliteRect = this.grafEd.getHiliteRect();
  if (hiliteRect) {
    this.renderer.strokeRectCornersXYXY(
        hiliteRect[0], hiliteRect[1],
        hiliteRect[2], hiliteRect[3]);
  }
  this.strokeHiliteForIds(this.grafEd.getHilitedIds());

  // hover
  this.renderer.setStrokeStyle(GrafUi.HOVER_COLOR);
  this.strokeHiliteForIds(this.grafGeom.getIdsAtXY(this.worldPos.x, this.worldPos.y));
  this.strokeHiliteForEditButton(this.grafGeom.getNearestEditButtonPartId(this.worldPos));

  // link-mode indicator, when there's no staged link operation
  if (this.mode == GrafUi.Mode.DRAG_JACK && !this.grafEd.hasStagedOps()) {
    this.renderer.context.lineWidth = GrafRend.MODEL_LINE_WIDTH / this.renderer.getZoom();
    this.renderer.setStrokeStyle(GrafRend.MODEL_PREVIEW_STROKE_STYLE);
    this.renderer.drawLineVV(
        this.grafGeom.getPosById(this.grafEd.dragJackId),
        this.grafEd.dragJackEnd);
  }

  this.renderer.transformEnd();
  this.viewDirty = false;

};

GrafUi.prototype.strokeHiliteForIds = function(ids) {
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var pos = this.grafGeom.getPosById(id);
    var rad = this.grafGeom.getRadById(id);
    this.renderer.strokeCirclePosXYRad(pos.x, pos.y, rad);
  }
};

GrafUi.prototype.strokeHiliteForEditButton = function(id) {
  if (!id) return;
  var pos = this.grafGeom.getEditButtonPos(id);
  this.renderer.strokeCirclePosXYRad(pos.x, pos.y, GrafGeom.EDIT_RADIUS);
};