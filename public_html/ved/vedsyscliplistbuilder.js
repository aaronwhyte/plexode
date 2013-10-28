/**
 * Static namespace only.
 * @type {Object}
 */
VedSysClipListBuilder = {};

/**
 * @return {ClipList}
 */
VedSysClipListBuilder.createDefaultInstance = function() {
  return VedSysClipListBuilder.createFromMap(
      VedSysClipListBuilder.createDefaultDataMap());
};

/**
 * @param {Object} idToGraf map from ved type name to graf for that clip
 * @return {ClipList}
 */
VedSysClipListBuilder.createFromMap = function(idToGraf) {
  var clipList = new ClipList();
  for (var id in idToGraf) {
    var graf = idToGraf[id];
    var clip = new Clip(0, id, graf);
    clipList.addClip(id, clip);
  }
  return clipList;
};

/**
 * @return {Object} map from ved type to graf for that clip
 */
VedSysClipListBuilder.createDefaultDataMap = function() {
  var map = {};

  var templates = VedTemplates.getClusterMap();
  for (var vedType in templates) {
    var template = templates[vedType];
    var id = template.id;
    var params = [id, 1]; // "1" is the cluster ID
    // X, Y
    if (vedType == VedType.WALL || vedType == VedType.PORTAL) {
      // These templates have four point coords.
      plex.array.extend(params, [-Transformer.WALL_RADIUS * 1.5, 0, Transformer.WALL_RADIUS * 1.5, 0]);
    } else {
      plex.array.extend(params, [0, 0]);
    }
    // Misc params
    if (vedType == VedType.EXIT) {
      params.push('.'); // url
    } else if (vedType == VedType.TIMER) {
      params.push(100); // timeout in game clocks (1/60 seconds)
    }
    var ops = template.generateOps(params);
    var model = new GrafModel();
    model.applyOps(ops);
    map[id] = model;
  }
  return map;
};
