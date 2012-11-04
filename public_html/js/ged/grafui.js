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
 * @param plugin  app-specific thing with invalidate() and render(model)
 * @constructor
 */
function GrafUi(grafEd, renderer, plugin) {
  this.grafEd = grafEd;
  this.renderer = renderer;
  this.plugin = plugin;
  this.viewDirty = true;
  this.pointerWorldPosChanged = false;
  this.mode = GrafUi.Mode.DEFAULT;

  this.loop = null;
  this.canvasPos = new Vec2d(1, 1);
  this.worldPos = new Vec2d();
  this.deltaZoom = 0;
  this.panning = false;
}

GrafUi.FPS = 30;

GrafUi.MAX_ZOOM = 10;
GrafUi.MIN_ZOOM = 0.01;

GrafUi.HILITE_COLOR = 'rgba(255, 255, 255, 0.9)';

GrafUi.SELECTION_RENDER_PADDING = 8;

GrafUi.SELECTION_COLORS = [
  'rgba(0, 255, 100, 0.95)',
  'rgba(220, 180, 0, 0.85)',
  'rgba(210, 100, 0, 0.5)',
  'rgba(200, 40, 0, 0.2)'
];

/**
 * @enum {String}
 */
GrafUi.Mode = {
  DRAG: 'drag',
  SELECT: 'select',
  DEFAULT: 'default'
};

/**
 * @enum {number}
 */
GrafUi.KeyCodes = {
  DRAG: VK_D,
  ADD_SELECTIONS: VK_A,
  SELECT: VK_S
};

GrafUi.prototype.startLoop = function() {
  this.grafEd.setCallback(this.getGrafEdInvalidationCallback());
  if (!this.listeners) {
    this.listeners = new plex.event.ListenerTracker();
    this.listeners.addListener(document, 'mousemove', this.getMouseMoveListener());
    this.listeners.addListener(this.renderer.canvas, 'mousedown', this.getMouseDownListener());
    this.listeners.addListener(document, 'mouseup', this.getMouseUpListener());
    this.listeners.addListener(this.renderer.canvas, 'mousewheel', this.getMouseWheelListener());
    this.listeners.addListener(document, 'keydown', this.getKeyDownListener());
    this.listeners.addListener(document, 'keyup', this.getKeyUpListener());
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
    //self.setCanvasPosWithEvent(event);
    self.deltaZoom += event['wheelDeltaY'];
    event.preventDefault();
    return false;
  };
};

GrafUi.prototype.getKeyDownListener = function() {
  var self = this;
  return function(event) {
    event = event || window.event;
    var kc = event.keyCode;
    if (kc == GrafUi.KeyCodes.ADD_SELECTIONS) {
      self.viewDirty = true;
      if (!event.shiftKey) {
        self.grafEd.addSelections();
      } else {
        self.grafEd.subtractSelections();
      }
    }
    if (event.shiftKey && kc == GrafUi.KeyCodes.SELECT) {
      self.grafEd.popSelection();
    }
    if (self.mode == GrafUi.Mode.DEFAULT) {
      if (kc == GrafUi.KeyCodes.DRAG) {
        self.mode = GrafUi.Mode.DRAG;
        self.grafEd.startDragVec(self.worldPos);
      } else if (kc == GrafUi.KeyCodes.SELECT) {
        self.mode = GrafUi.Mode.SELECT;
        self.grafEd.startSelectionVec(self.worldPos);
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
      .addXY(-this.renderer.canvasWidth/2, -this.renderer.canvasHeight/2)
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

  this.plugin.render(this.grafEd.getModel());

  this.renderer.transformStart();
  this.renderer.setStrokeStyle('rgba(255, 255, 255, 0.2)');
  this.renderer.context.lineWidth = 15;

  var graf = this.grafEd.getModel();

  // clusters, parts, jacks
  for (var clusterId in graf.clusters) {
    this.drawCluster(graf.getCluster(clusterId));
  }

  // links
  for (var linkId in graf.links) {
    this.drawLink(graf.links[linkId]);
  }

  // selections
  var selectionsSize = this.grafEd.getSelectionsSize();
  var alpha = 0.9;
  this.renderer.context.lineWidth = 8;
  for (var i = 0; i < Math.min(selectionsSize, GrafUi.SELECTION_COLORS.length); i++) {
    this.renderer.setStrokeStyle(GrafUi.SELECTION_COLORS[i]);
    var selIds = this.grafEd.getSelectedIds(i);
    for (var s = 0; s < selIds.length; s++) {
      var id = selIds[s];
      var selPos = this.grafEd.getPosById(id);
      var selRad = this.grafEd.getRadById(id);
      selRad += (GrafUi.SELECTION_COLORS.length - i) * GrafUi.SELECTION_RENDER_PADDING;
      this.renderer.strokeCirclePosXYRad(selPos.x, selPos.y, selRad);
    }
    alpha *= 0.75;
  }

  // hilite
  this.renderer.setStrokeStyle(GrafUi.HILITE_COLOR);
  var hiliteRect = this.grafEd.getHiliteRect();
  if (hiliteRect) {
    this.renderer.strokeRectCornersXYXY(
        hiliteRect[0], hiliteRect[1],
        hiliteRect[2], hiliteRect[3]);
  }
  this.strokeHiliteForIds(this.grafEd.getHilitedIds());
  this.strokeHiliteForIds(this.grafEd.getHoverIds(this.worldPos.x, this.worldPos.y));

  this.renderer.transformEnd();
  this.viewDirty = false;
};

GrafUi.prototype.strokeHiliteForIds = function(ids) {
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var pos = this.grafEd.getPosById(id);
    var rad = this.grafEd.getRadById(id);
    this.renderer.strokeCirclePosXYRad(pos.x, pos.y, rad);
  }
};

GrafUi.prototype.drawCluster = function(cluster) {
  var parts = cluster.getPartList();
  for (var i = 0; i < parts.length; i++) {
    this.drawPart(parts[i]);
  }
};

GrafUi.prototype.drawPart = function(part) {
  this.renderer.strokeCirclePosXYRad(part.x, part.y, GrafEd.PART_RADIUS);
  for (var jackId in part.jacks) {
    var jackPos = this.grafEd.getJackPos(jackId);
    this.renderer.strokeCirclePosXYRad(jackPos.x, jackPos.y, GrafEd.JACK_RADIUS);
  }
};

GrafUi.prototype.drawLink = function(link) {
  this.renderer.drawLineVV(
      this.grafEd.getJackPos(link.jackId1),
      this.grafEd.getJackPos(link.jackId2));
};
