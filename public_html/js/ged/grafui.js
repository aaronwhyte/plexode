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
 * @param {GrafEd} grafEd
 * @param {Renderer} renderer
 * @param {GrafRend} grafRend
 * @param {GrafGeom} grafGeom
 * @param plugin  app-specific thing with invalidate() and render(model)
 * @constructor
 */
function GrafUi(grafEd, renderer, grafRend, grafGeom, plugin) {
  this.grafEd = grafEd;
  this.renderer = renderer;
  this.grafRend = grafRend;
  this.grafGeom = grafGeom;
  this.plugin = plugin;

  this.viewDirty = true;
  this.pointerWorldPosChanged = true;
  this.mode = GrafUi.Mode.DEFAULT;

  this.loop = null;
  this.canvasPos = new Vec2d(Math.Infinity, Math.Infinity);
  this.worldPos = new Vec2d(Math.Infinity, Math.Infinity);
  this.deltaZoom = 0;
  this.panning = false;

  this.contentsFramed = false;
}

GrafUi.FPS = 30;

GrafUi.MAX_ZOOM = 10;
GrafUi.MIN_ZOOM = 0.01;

GrafUi.HILITE_COLOR = 'rgba(255, 255, 255, 0.9)';

GrafUi.SELECTION_RENDER_PADDING = 2;

GrafUi.SELECTION_COLORS = [
  'rgba(0, 255, 100, 0.95)',
  'rgba(220, 180, 0, 0.85)',
  'rgba(210, 100, 0, 0.5)',
  'rgba(200, 40, 0, 0.2)'
];

GrafUi.MODEL_LINE_WIDTH = 1.5;
GrafUi.SELECTION_LINE_WIDTH = 2;
GrafUi.HILITE_LINE_WIDTH = 1.5;

/**
 * @enum {String}
 */
GrafUi.Mode = {
  DEFAULT: 'default',
  DRAG: 'drag',
  SELECT: 'select'
};

/**
 * @enum {number}
 */
GrafUi.KeyCodes = {
  ADD_SELECTIONS: VK_A,
  DELETE: VK_DELETE,
  DELETE2: VK_BACKSPACE,
  DRAG: VK_D,
  LINK: VK_L,
  SELECT: VK_S,
  UNDO: VK_Z
};

GrafUi.prototype.startLoop = function() {
  this.grafEd.setCallback(this.getGrafEdInvalidationCallback());
  this.resize();
  if (!this.contentsFramed) {
    this.grafRend.frameContents();
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
    self.panning = true;
    self.setCanvasPosWithEvent(event);
  };
};

GrafUi.prototype.getMouseUpListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    event = event || window.event;
    self.panning = false;
    self.setCanvasPosWithEvent(event);
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
    event.preventDefault();
    return false;
  };
};

GrafUi.prototype.getKeyDownListener = function() {
  var self = this;
  return function(event) {
    event = event || window.event;
    var kc = event.keyCode;

    // add/subtract selections
    if (kc == GrafUi.KeyCodes.ADD_SELECTIONS) {
      self.viewDirty = true;
      if (!event.shiftKey) {
        self.grafEd.addSelections();
      } else {
        self.grafEd.subtractSelections();
      }
    }

    // select pseudomode, or undo (pop) selection
    if (kc == GrafUi.KeyCodes.SELECT && self.mode == GrafUi.Mode.DEFAULT) {
      self.viewDirty = true;
      if (event.shiftKey) {
        self.grafEd.popSelection();
      } else {
        self.mode = GrafUi.Mode.SELECT;
        self.grafEd.startSelectionVec(self.worldPos);
      }
    }

    // drag
    if (kc == GrafUi.KeyCodes.DRAG && self.mode == GrafUi.Mode.DEFAULT) {
      self.mode = GrafUi.Mode.DRAG;
      self.grafEd.startDragVec(self.worldPos);
    }

    // delete
    if (kc == GrafUi.KeyCodes.DELETE || kc == GrafUi.KeyCodes.DELETE2) {
      self.viewDirty = true;
      self.plugin.invalidate();
      self.grafEd.deleteSelection();
      // don't do browser "back" navigation
      event.preventDefault();
    }

    // link
    if (kc == GrafUi.KeyCodes.LINK) {
      self.viewDirty = true;
      self.plugin.invalidate();
      self.grafEd.linkSelectedJacks();
    }

    // undo/redo
    if (kc == GrafUi.KeyCodes.UNDO) {
      self.viewDirty = true;
      self.plugin.invalidate();
      if (!event.shiftKey) {
        self.grafEd.undo();
      } else {
        self.grafEd.redo();
      }
    }

  };
};

GrafUi.prototype.getKeyUpListener = function() {
  var self = this;
  return function(event) {
    event = event || window.event;
    if (self.mode == GrafUi.Mode.DRAG && event.keyCode == GrafUi.KeyCodes.DRAG) {
      self.grafEd.continueDragVec(self.worldPos);
      self.grafEd.endDrag();
      self.viewDirty = true;
      self.mode = GrafUi.Mode.DEFAULT;
    }
    if (self.mode == GrafUi.Mode.SELECT && event.keyCode == GrafUi.KeyCodes.SELECT) {
      self.grafEd.continueSelectionVec(self.worldPos);
      self.grafEd.endSelection();
      self.viewDirty = true;
      self.mode = GrafUi.Mode.DEFAULT;
    }
  };
};

GrafUi.prototype.getResizeListener = function() {
  var self = this;
  return function(event) {
    self.resize();
  };
};

GrafUi.prototype.resize = function() {
  var s = plex.window.getSize();
  this.renderer.canvas.width = s.width;
  this.renderer.canvas.height = s.height;
  this.viewDirty = true;
};

GrafUi.prototype.setCanvasPosWithEvent = function(event) {
  var target = plex.event.getTarget(event);
  var canvas = this.renderer.canvas;
  this.canvasPos.setXY(
      event.pageX - canvas.offsetLeft - canvas.clientLeft,
      event.pageY - canvas.offsetTop - canvas.clientTop);
};

GrafUi.prototype.getWorldPosOfCanvasPos = function() {
  return (new Vec2d())
      .set(this.canvasPos)
      .addXY(-this.renderer.canvas.width/2, -this.renderer.canvas.height/2)
      .scale(1/this.renderer.camera.zoom)
      .add(this.renderer.camera.pan);
};

GrafUi.prototype.setWorldPos = function(pos) {
  this.worldPos.set(pos);
};

GrafUi.prototype.clock = function() {

  if (this.pointerWorldPosChanged) {
    this.setWorldPos(this.getWorldPosOfCanvasPos());
    this.pointerWorldPosChanged = false;
  }
  if (this.mode == GrafUi.Mode.SELECT) {
    this.grafEd.continueSelectionXY(this.worldPos.x, this.worldPos.y);
  } else if (this.mode == GrafUi.Mode.DRAG) {
    this.grafEd.continueDragXY(this.worldPos.x, this.worldPos.y);
    this.plugin.invalidate();
  }

  // Zooming
  if (this.deltaZoom) {
    this.viewDirty = true;
    this.renderer.scaleZoom(Math.exp(this.deltaZoom/2000));
    var z = this.renderer.camera.getZoom();
    if (z < GrafUi.MIN_ZOOM) this.renderer.setZoom(GrafUi.MIN_ZOOM);
    if (z > GrafUi.MAX_ZOOM) this.renderer.setZoom(GrafUi.MAX_ZOOM);
    this.deltaZoom = 0;
  }

  // If the the pointer's screen position doesn't match the pointer's world position,
  // then this will pan the canvas to adjust.
  // This is the mechanism that makes the pointer stick to the world perfectly while zooming,
  // and it's the way the view gets scrolled when panning.
  var worldPosOfCanvasPos = this.getWorldPosOfCanvasPos();
  var panCorrection = worldPosOfCanvasPos.subtract(this.worldPos).scale(-1);
  this.renderer.addPan(panCorrection);

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
