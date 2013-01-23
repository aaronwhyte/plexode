/**
 * Widget for rendering and selecting a menu model clips.
 * @param {ClipList} clipList
 * @param {Object} pluginFactory with create(canvas) that returns a plugin
 * @param {Element} wrapper
 * @constructor
 */
function ClipMenu(clipList, pluginFactory, wrapper) {
  this.clipList = clipList;
  this.pluginFactory = pluginFactory;
  this.wrapper = wrapper;

  this.onSelect = null;
}

ClipMenu.prototype.render = function() {
  var clip;
  for (var i = 0; clip = this.clipList.getClipByOrder(i); i++) {
    var canvas = plex.dom.ce('canvas', this.wrapper);
    canvas.className = 'gedSysClip';
    canvas.width = 200;
    canvas.height = 150;
    canvas.onclick = this.getClickHandler(clip.id);
    var renderer = new Renderer(canvas, new Camera());
    var grafRend = new GrafRend(
        this.pluginFactory.create(renderer),
        renderer,
        new GrafGeom(clip.model));
    grafRend.frameContents(0.8);
    grafRend.draw();
  }
};

ClipMenu.prototype.hide = function() {
  this.wrapper.style.display = 'none';
};

ClipMenu.prototype.toggle = function() {
  this.wrapper.style.display = this.wrapper.style.display == 'none' ? 'block' : 'none';
};

ClipMenu.prototype.setOnSelect = function(fn) {
  this.onSelect = fn;
};

ClipMenu.prototype.getClickHandler = function(clipId) {
  var self = this;
  return function() {
    var clip = self.clipList.getClipById(clipId);
    if (self.onSelect) {
      self.onSelect(clip);
    }
  };
};
