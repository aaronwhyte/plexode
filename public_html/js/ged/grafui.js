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
  this.pointerDirty = true;
  this.mode = GrafUi.Mode.DEFAULT;

  this.loop = null;
  this.screenPos = new Vec2d(1, 1);
  this.worldPos = new Vec2d();
}

GrafUi.FPS = 30;

GrafUi.HILITE_COLOR = 'rgba(255, 255, 255, 0.9)';

GrafUi.SELECTION_COLORS = [
  'rgba(0, 255, 100, 0.95)',
  'rgba(220, 180, 0, 0.85)',
  'rgba(210, 90, 0, 0.35)',
  'rgba(200, 40, 0, 0.2)'
];


/**
 * @enum {String}
 */
GrafUi.Mode = {
  DRAGGING: 'dragging',
  SELECTING: 'selecting',
  DEFAULT: 'default'
};

GrafUi.prototype.startLoop = function() {
  if (!this.listeners) {
    this.listeners = new plex.event.ListenerTracker();
    this.listeners.addListener(this.renderer.canvas, 'mousemove', this.getMouseMoveListener());
    this.listeners.addListener(this.renderer.canvas, 'mousedown', this.getMouseDownListener());
    this.listeners.addListener(this.renderer.canvas, 'mouseup', this.getMouseUpListener());
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
};

GrafUi.prototype.getMouseMoveListener = function() {
  // Because there can be lots of mousemoves between frames,
  // defer handling moves until clock().
  var self = this;
  return function(event) {
    self.pointerDirty = true;
    var event = event || window.event;
    self.setScreenPosWithEvent(event);
  };
};

GrafUi.prototype.getMouseDownListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    var event = event || window.event;
    self.setScreenPosWithEvent(event);
    if (self.mode == GrafUi.Mode.DEFAULT) {
      self.mode = GrafUi.Mode.SELECTING;
      self.grafEd.startSelectionXY(self.worldPos.x, self.worldPos.y);
    }
    self.pointerDirty = false;
  };
};

GrafUi.prototype.getMouseUpListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    var event = event || window.event;
    self.setScreenPosWithEvent(event);
    if (self.mode == GrafUi.Mode.SELECTING) {
      self.grafEd.continueSelectionXY(self.worldPos.x, self.worldPos.y);
      self.grafEd.endSelection();
      self.mode = GrafUi.Mode.DEFAULT;
    } else if (self.mode == GrafUi.Mode.DRAGGING) {
      self.grafEd.continueDragXY(self.worldPos.x, self.worldPos.y);
      self.grafEd.endDrag();
      self.plugin.invalidate();
      self.mode = GrafUi.Mode.DEFAULT;
    }
    self.pointerDirty = false;
  };
};

GrafUi.prototype.getKeyDownListener = function() {
  var self = this;
  return function(event) {
    var event = event || window.event;
    if (self.mode == GrafUi.Mode.DEFAULT && event.keyCode == VK_Z) {
      self.mode = GrafUi.Mode.DRAGGING;
      self.grafEd.startDragXY(self.worldPos.x, self.worldPos.y);
    }
  };
};

GrafUi.prototype.getKeyUpListener = function() {
  var self = this;
  return function(event) {
    var event = event || window.event;
    if (self.mode == GrafUi.Mode.DRAGGING && event.keyCode == VK_Z) {
      self.grafEd.continueDragXY(self.worldPos.x, self.worldPos.y);
      self.grafEd.endDrag();
      self.mode = GrafUi.Mode.DEFAULT;
    }
  };
};

GrafUi.prototype.setScreenPosWithEvent = function(event) {
  var target = plex.event.getTarget(event);
  this.setScreenPos(
      event.pageX - target.offsetLeft,
      event.pageY - target.offsetTop);
};

GrafUi.prototype.setScreenPos = function(x, y) {
  this.screenPos.setXY(x, y);
  this.updateWorldPos();
};

GrafUi.prototype.updateWorldPos = function() {
  this.worldPos.set(this.screenPos)
      .addXY(-this.renderer.canvasWidth/2, -this.renderer.canvasHeight/2)
      .subtract(this.renderer.camera.pan)
      .scale(1/this.renderer.camera.zoom);
};


GrafUi.prototype.clock = function() {
  if (this.pointerDirty) {
    if (this.mode == GrafUi.Mode.SELECTING) {
      this.grafEd.continueSelectionXY(this.worldPos.x, this.worldPos.y);
      this.viewDirty = true;
    } else if (this.mode == GrafUi.Mode.DRAGGING) {
      this.grafEd.continueDragXY(this.worldPos.x, this.worldPos.y);
      this.plugin.invalidate();
      this.viewDirty = true;
    }
    this.pointerDirty = false;
  }
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
  for (var i = 0; i < Math.min(selectionsSize, GrafUi.SELECTION_COLORS.length); i++) {
    this.renderer.setStrokeStyle(GrafUi.SELECTION_COLORS[i]);
    var selIds = this.grafEd.getSelectedIds(i);
    for (var s = 0; s < selIds.length; s++) {
      var id = selIds[s];
      var selPos = this.grafEd.getPosById(id);
      var rad = GrafEd.PART_RADIUS + GrafEd.SELECTION_PADDING;
      rad -= i * GrafEd.SELECTION_PADDING / GrafUi.SELECTION_COLORS.length;
      this.renderer.strokeCirclePosXYRad(selPos.x, selPos.y, rad); //TODO: more deets, not just pos.
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
  var hilitedIds = this.grafEd.getHilitedIds();
  var hoverId = this.grafEd.getNearestId(this.worldPos, GrafEd.PART_RADIUS + GrafEd.SELECTION_PADDING);
  if (hoverId) hilitedIds.push(hoverId);
  for (var i = 0; i < hilitedIds.length; i++) {
    var id = hilitedIds[i];
    var hilitePos = this.grafEd.getPosById(id);
    this.renderer.strokeCirclePosXYRad(hilitePos.x, hilitePos.y, GrafEd.PART_RADIUS); //TODO: more deets, not just pos.
  }

  this.renderer.transformEnd();
  this.viewDirty = false;
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
