/**
 * State data for a view in a 2d plane, including pan and zoom.
 *
 * @constructor
 */
function Camera() {
  this.pan = new Vec2d();
  this.zoom = 1;
}


Camera.prototype.setPanXY = function(x, y) {
  this.pan.setXY(x, y);
};

Camera.prototype.setZoom = function(zoom) {
  this.zoom = zoom;
};


Camera.prototype.getPanX = function() {
  return this.pan.x;
};

Camera.prototype.getPanY = function() {
  return this.pan.y;
};

Camera.prototype.getZoom = function() {
  return this.zoom;
};

Camera.prototype.getPan = function() {
  return this.pan;
};
