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

GrafRend.DATA_BUTTON_TEXT = '\u270E';

GrafRend.MODEL_LINE_WIDTH = 3;
GrafRend.MODEL_STROKE_STYLE = 'rgba(255, 255, 255, 0.3)';
GrafRend.MODEL_PREVIEW_STROKE_STYLE = 'rgba(255, 255, 255, 0.15)';

GrafRend.LABEL_LINE_WIDTH = 12/6;
GrafRend.LABEL_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)';
GrafRend.LABEL_FILL_STYLE = 'rgba(255, 255, 255, 0.5)';
GrafRend.LABEL_FONT = '12pt Lucida Grande, Courier New, sans serif';

GrafRend.DATA_LINE_WIDTH = 7/6;
GrafRend.DATA_STROKE_STYLE = 'rgba(0, 0, 0, 0.5)';
GrafRend.DATA_FILL_STYLE = 'rgba(255, 255, 255, 0.5)';
GrafRend.DATA_FONT = '7pt Lucida Grande, Courier New, sans serif';

GrafRend.EDIT_BUTTON_FONT = '8pt Lucida Grande, Courier New, sans serif';

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
  this.renderer.setFillStyle(GrafRend.MODEL_STROKE_STYLE);
  this.renderer.context.lineWidth = GrafRend.MODEL_LINE_WIDTH / this.renderer.getZoom();

  // links
  for (var linkId in model.links) {
    this.drawLink(model.links[linkId]);
  }

  // clusters, parts, jacks
  for (var clusterId in model.clusters) {
    this.drawCluster(model.getCluster(clusterId));
  }

  // labels
  this.renderer.context.lineWidth = GrafRend.LABEL_LINE_WIDTH / this.renderer.getZoom();
  this.renderer.context.font = GrafRend.LABEL_FONT;
  this.renderer.context.textAlign = 'center';
  this.renderer.context.textBaseline = 'middle';
  this.renderer.setStrokeStyle(GrafRend.LABEL_STROKE_STYLE);
  this.renderer.setFillStyle(GrafRend.LABEL_FILL_STYLE);
  for (var clusterId in model.clusters) {
    this.drawClusterLabels(model.getCluster(clusterId));
  }

  // data
  this.renderer.context.lineWidth = GrafRend.DATA_LINE_WIDTH / this.renderer.getZoom();
  this.renderer.context.font = GrafRend.DATA_FONT;
  this.renderer.context.textAlign = 'left';
  this.renderer.context.textBaseline = 'top';
  this.renderer.setStrokeStyle(GrafRend.DATA_STROKE_STYLE);
  this.renderer.setFillStyle(GrafRend.DATA_FILL_STYLE);
  for (var clusterId in model.clusters) {
    this.drawClusterData(model.getCluster(clusterId));
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

GrafRend.prototype.drawClusterLabels = function(cluster) {
  var parts = cluster.getPartList();
  for (var i = 0; i < parts.length; i++) {
    this.drawPartLabels(parts[i], cluster);
  }
};

GrafRend.prototype.drawPartLabels = function(part, cluster) {
  var text = part.data.type || cluster.data.type || null;
  if (text) {
    text = text.replace('_', ' ');
    this.renderer.context.strokeText(text, part.x, part.y);
    this.renderer.context.fillText(text, part.x, part.y);
  }
};

GrafRend.prototype.drawClusterData = function(cluster) {
  var parts = cluster.getPartList();
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].hasData()) {
      this.drawPartData(parts[i], cluster);
    }
  }
};

GrafRend.prototype.drawPartData = function(part, cluster) {
  var editPos = Vec2d.alloc();
  this.geom.getEditButtonPos(part.id, editPos);
  this.renderer.context.textAlign = 'center';
  this.renderer.context.textBaseline = 'middle';
  this.renderer.context.strokeText(GrafRend.DATA_BUTTON_TEXT, editPos.x, editPos.y);
  this.renderer.context.fillText(GrafRend.DATA_BUTTON_TEXT, editPos.x, editPos.y);
  this.renderer.fillCirclePosXYRad(editPos.x, editPos.y, GrafGeom.EDIT_RADIUS);

  var x = editPos.x + GrafGeom.EDIT_RADIUS * 1.2;
  var y = editPos.y;
  this.renderer.context.textAlign = 'left';
  for (var key in part.data) {
    var val = part.data[key];
    var text = key + ':' + val;
    this.renderer.context.strokeText(text, x, y);
    this.renderer.context.fillText(text, x, y);
    y += 9;
  }
};

