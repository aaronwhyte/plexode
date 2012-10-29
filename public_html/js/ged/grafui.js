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
  this.mode = GrafUi.Mode.DEFAULT;

  this.loop = null;
  this.screenPos = new Vec2d(1, 1);
  this.worldPos = new Vec2d();
}

GrafUi.FPS = 30;

/**
 * @enum {String}
 */
GrafUi.Mode = {
  SELECTING: 'selecting',
  DEFAULT: 'default'
};

GrafUi.prototype.startLoop = function() {
  // TODO: replace GU_startKeyListener with nicer thing
  GU_startKeyListener();
  plex.event.addListener(this.renderer.canvas, 'mousemove', this.getMouseMoveListener());
  plex.event.addListener(this.renderer.canvas, 'mousedown', this.getMouseDownListener());
  plex.event.addListener(this.renderer.canvas, 'mouseup', this.getMouseUpListener());
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
  if (this.loop) {
    this.loop.stop();
  }
};

GrafUi.prototype.getMouseMoveListener = function() {
  var self = this;
  return function(event) {
    self.viewDirty = true;
    var event = event || window.event;
    self.setScreenPosWithEvent(event);
    if (self.mode == GrafUi.Mode.SELECTING) {
      self.grafEd.continueSelectionXY(self.worldPos.x, self.worldPos.y);
    }
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

  // hilite
  var selectionRect = this.grafEd.getSelectionRect();
  if (selectionRect) {
    this.renderer.setStrokeStyle('rgba(0, 255, 0, 0.2)');
    this.renderer.strokeRectCornersXYXY(
        selectionRect[0], selectionRect[1],
        selectionRect[2], selectionRect[3]);
  }
  var hilitedIds = this.grafEd.getHilitedIds();
  this.renderer.setStrokeStyle('rgba(0, 255, 0, 0.5)');
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
