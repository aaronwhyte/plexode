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
 * @param {GrafUiKeyCombos} keyCombos
 * @constructor
 */
function GrafUi(grafEd, renderer, grafRend, grafGeom, plugin, clipboard, keyCombos) {
  this.grafEd = grafEd;
  this.renderer = renderer;
  this.grafRend = grafRend;
  this.grafGeom = grafGeom;
  this.plugin = plugin;
  this.clipboard = clipboard;
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
}

GrafUi.FPS = 30;

GrafUi.MAX_ZOOM = 10;
GrafUi.MIN_ZOOM = 0.01;

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
  SELECT: 'select'
};

/**
 * Names of the actions the user can in the grafui.
 * @enum {string}
 */
GrafUi.Action = {
  SELECT: 'select',
  UNSELECT: 'unselect',
  ADD_SELECTIONS: 'add_selections',
  SUBTRACT_SELECTIONS: 'subtract_selections',

  COPY: 'copy',
  PASTE: 'paste',
  DELETE: 'delete',

  DRAG_SELECTION: 'drag',
  LINK: 'link',

  UNDO: 'undo',
  REDO: 'redo'
};

GrafUi.prototype.startLoop = function() {
  this.grafEd.setCallback(this.getGrafEdInvalidationCallback());
  this.resize();
  this.clipboard.start();
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
  if (this.listeners) {
    this.listeners.removeAllListeners();
    this.listeners = null;
  }
  if (this.loop) {
    this.loop.stop();
  }
  this.grafEd.unsubscribe();
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
    // panning, dragging, or linking, depending on what was touched.
    var id = self.grafGeom.getIdAtVec(self.getWorldPosOfCanvasPos());
    if (id == null) {
      self.panning = true;
      self.setCanvasPosWithEvent(event);
    } else {
      if (self.grafEd.isSelected(id)) {
        self.startDraggingSelection();
      } else if (self.grafEd.getPart(id)) {
        self.startDraggingPart(id);
      } else if (self.grafEd.getJack(id)) {
        self.startDraggingJack(id);
      }
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

    if (self.mode == GrafUi.Mode.DRAG_SELECTION) {
      self.endDraggingSelection();
    }
    if (self.mode == GrafUi.Mode.DRAG_PART) {
      self.endDraggingPart();
    }
    if (self.mode == GrafUi.Mode.DRAG_JACK) {
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
    event = event || window.event;

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

    // Mouse-motion quasimodes only work once we know where the mouse is.
    // Only allow one quasimode at a time.
    if (self.canvasPos && self.mode == GrafUi.Mode.DEFAULT) {

      // select pseudomode, or undo (pop) selection
      if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.SELECT)) {
        self.viewDirty = true;
        self.mode = GrafUi.Mode.SELECT;
        self.grafEd.startSelectionVec(self.worldPos);
      }
      if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.UNSELECT)) {
        self.viewDirty = true;
        self.grafEd.popSelection();
      }

      // drag pseudomode
      if (self.keyCombos.eventMatchesAction(event, GrafUi.Action.DRAG_SELECTION)) {
        self.mode = GrafUi.Mode.DRAG_SELECTION;
        self.grafEd.startDraggingSelectionVec(self.worldPos);
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
    event = event || window.event;
    if (self.mode == GrafUi.Mode.PASTE &&
        self.keyCombos.eventMatchesAction(event, GrafUi.Action.PASTE)) {
      self.grafEd.continuePasteVec(self.worldPos);
      self.grafEd.endPaste();
      self.viewDirty = true;
      self.mode = GrafUi.Mode.DEFAULT;
    }
    if (self.mode == GrafUi.Mode.DRAG_SELECTION &&
        self.keyCombos.eventMatchesAction(event, GrafUi.Action.DRAG_SELECTION)) {
      self.endDraggingSelection();
    }
    if (self.mode == GrafUi.Mode.SELECT &&
        self.keyCombos.eventMatchesAction(event, GrafUi.Action.SELECT)) {
      self.grafEd.continueSelectionVec(self.worldPos);
      self.grafEd.endSelection();
      self.viewDirty = true;
      self.mode = GrafUi.Mode.DEFAULT;
    }
  };
};


GrafUi.prototype.startDraggingSelection = function() {
  this.mode = GrafUi.Mode.DRAG_SELECTION;
  this.grafEd.startDraggingSelectionVec(this.worldPos);
};

GrafUi.prototype.endDraggingSelection = function() {
  this.grafEd.continueDraggingSelectionVec(this.worldPos);
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
  this.grafEd.continueDraggingPartVec(this.worldPos);
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
    this.grafEd.continueDraggingSelectionVec(this.worldPos);
    this.plugin.invalidate();
  } else if (this.mode == GrafUi.Mode.DRAG_PART) {
    this.grafEd.continueDraggingPartVec(this.worldPos);
    this.plugin.invalidate();
  } else if (this.mode == GrafUi.Mode.DRAG_JACK) {
    this.grafEd.continueDraggingJackVec(this.worldPos);
    this.plugin.invalidate();
  } else if (this.mode == GrafUi.Mode.PASTE) {
    this.grafEd.continuePasteVec(this.worldPos);
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
