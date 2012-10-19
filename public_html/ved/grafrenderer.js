function GrafRenderer(grafModel, renderer, grafEd) {
  this.graf = grafModel;
  this.renderer = renderer;
  this.grafEd = grafEd;
}

GrafRenderer.prototype.draw = function() {
  this.renderer.transformStart();
  this.renderer.setStrokeStyle('rgba(255, 255, 255, 0.6)');
  this.renderer.context.lineWidth = 10;

  // clusters, parts, jacks
  for (var clusterId in this.graf.clusters) {
    this.drawCluster(this.graf.getCluster(clusterId));
  }

  // links
  for (var linkId in this.graf.links) {
    this.drawLink(this.graf.links[linkId]);
  }
  this.renderer.transformEnd();
};

GrafRenderer.prototype.drawCluster = function(cluster) {
  var parts = cluster.getPartList();
  for (var i = 0; i < parts.length; i++) {
    this.drawPart(parts[i]);
  }
};

GrafRenderer.prototype.drawPart = function(part) {
  this.renderer.strokeCirclePosXYRad(part.x, part.y, 40);
  for (var jackId in part.jacks) {
    var jackPos = this.grafEd.getJackPos(jackId);
    this.renderer.strokeCirclePosXYRad(jackPos.x, jackPos.y, 10);
  }
};

GrafRenderer.prototype.drawLink = function(link) {
  var jackPos1 =
  this.renderer.drawLineVV(
      this.grafEd.getJackPos(link.jackId1),
      this.grafEd.getJackPos(link.jackId2));
};
