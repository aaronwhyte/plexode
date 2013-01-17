/**
 * Does the rendering.
 * - Owns the pluggable underlayer, and controls its camera.
 * - Overlays the graf rendering stuff on top.
 *
 * @param plugin  app-specific thing with invalidate() and render(model)
 * @param {Renderer} renderer
 * @param {GrafGeom} geom
 * @constructor
 */
function GrafRend(plugin, renderer, geom) {
  this.plugin = plugin;
  this.renderer = renderer;
  this.geom = geom;
  this.viewDirty = true;
}

GrafRend.MODEL_LINE_WIDTH = 3;
GrafRend.MODEL_STROKE_STYLE = 'rgba(255, 255, 255, 0.3)';
GrafRend.MODEL_PREVIEW_STROKE_STYLE = 'rgba(255, 255, 255, 0.17)';

GrafRend.prototype.resize = function(width, height) {
  this.renderer.canvas.width = width;
  this.renderer.canvas.height = height;
  this.viewDirty = true;
};

GrafRend.prototype.frameContents = function(scale) {
  var bounds = this.geom.getBoundingRect();
  if (!bounds) return;
  this.renderer.setCenter(
      (bounds.x0 + bounds.x1) / 2,
      (bounds.y0 + bounds.y1) / 2);
  var boundsWidth = bounds.x1 - bounds.x0;
  var boundsHeight = bounds.y1 - bounds.y0;
  var xZoom = this.renderer.canvas.width / boundsWidth;
  var yZoom = this.renderer.canvas.height / boundsHeight;
  this.renderer.setZoom(Math.min(xZoom, yZoom));
  this.renderer.scaleZoom(scale);
};

/**
 * @param {GrafModel} model
 */
GrafRend.prototype.setModelContents = function(model) {
  this.geom.setModelContents(model);
  this.plugin.invalidate();
};

/**
 * @return {GrafModel}
 */
GrafRend.prototype.getModel = function() {
  return this.geom.getModel();
};

GrafRend.prototype.draw = function() {
  var model = this.geom.getModel();

  this.plugin.render(model);

  this.renderer.transformStart();
  this.renderer.setStrokeStyle(GrafRend.MODEL_STROKE_STYLE);
  this.renderer.context.lineWidth = GrafRend.MODEL_LINE_WIDTH / this.renderer.getZoom();

  // clusters, parts, jacks
  for (var clusterId in model.clusters) {
    this.drawCluster(model.getCluster(clusterId));
  }

  // links
  for (var linkId in model.links) {
    this.drawLink(model.links[linkId]);
  }

  this.renderer.transformEnd();
};

GrafRend.prototype.drawCluster = function(cluster) {
  var parts = cluster.getPartList();
  for (var i = 0; i < parts.length; i++) {
    this.drawPart(parts[i]);
  }
};

GrafRend.prototype.drawPart = function(part) {
  this.renderer.strokeCirclePosXYRad(part.x, part.y, GrafGeom.PART_RADIUS);
  for (var jackId in part.jacks) {
    if (!part.jacks.hasOwnProperty(jackId)) continue;
    var jackPos = this.geom.getJackPos(jackId);
    this.renderer.strokeCirclePosXYRad(jackPos.x, jackPos.y, GrafGeom.JACK_RADIUS);
  }
};

GrafRend.prototype.drawLink = function(link) {
  this.renderer.drawLineVV(
      this.geom.getJackPos(link.jackId1),
      this.geom.getJackPos(link.jackId2));
};
