/**
 * Static namespace only.
 * @type {Object}
 */
SysClipListBuilder = {};

/**
 * @return {ClipList}
 */
SysClipListBuilder.createDefaultInstance = function() {
  return SysClipListBuilder.createFromMap(
      SysClipListBuilder.createDefaultDataMap());
};

/**
 * @param {plex.Map} idToGraf map from ved type name to graf op JSON for that clip
 * @return {ClipList}
 */
SysClipListBuilder.createFromMap = function(idToGraf) {
  var clipList = new ClipList();
  var ids = idToGraf.getKeys();
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var graf = idToGraf.get(id);
    var clip = new Clip(0, id, graf);
    clipList.addClip(id, clip);
  }
  return clipList;
};

/**
 * @return {plex.Map} from ved type to graf op JSON for that clip
 */
SysClipListBuilder.createDefaultDataMap = function() {
  var map = new plex.Map();

  function opsToAddCluster(id, type) {
    return [
      {
        type: GrafOp.Type.ADD_CLUSTER,
        id: id
      }, {
        type:GrafOp.Type.SET_DATA,
        id: id,
        key: 'type',
        value: type,
        oldValue: undefined
      }
    ];
  }

  function opsToAddPart(id, clusterId, opt_x, opt_y) {
    return [{
      type: GrafOp.Type.ADD_PART,
      id: id,
      clusterId: clusterId,
      x: opt_x || 0,
      y: opt_y || 0
    }];
  }

  function opsToSetData(id, key, value) {
    return [{
      type: GrafOp.Type.SET_DATA,
      id: id,
      key: key,
      value: value,
      oldValue: undefined
    }];
  }

  function opsToAddJack(jackId, partId, type) {
    return [{
      type: GrafOp.Type.ADD_JACK,
      id: jackId,
      partId: partId
    }].concat(opsToSetData(jackId, 'type', type));
  }

  function addOpsToMap(id, ops) {
    var graf = new GrafModel();
    graf.applyOps(ops);
    map.set(id, graf);
  }

  function addMonoPartCluster(type) {
    addOpsToMap(type, opsToAddCluster(1, type).concat(opsToAddPart(2, 1)));
  }

  function addBiPartCluster(type) {
    addOpsToMap(type, [].concat(
        opsToAddCluster(1, type),
        opsToAddPart(2, 1, 0, -Transformer.WALL_RADIUS * 2),
        opsToAddPart(3, 1, 0, Transformer.WALL_RADIUS * 2)));
  }

  addOpsToMap(VedType.BEAM_SENSOR, [].concat(
      opsToAddCluster(1, VedType.BEAM_SENSOR),
      opsToAddPart(2, 1),
      opsToAddJack(3, 2, JackAddress.Type.OUTPUT)));

  addMonoPartCluster(VedType.BLOCK);

  addOpsToMap(VedType.BUTTON, [].concat(
      opsToAddCluster(1, VedType.BUTTON),
      opsToAddPart(2, 1),
      opsToAddJack(3, 2, JackAddress.Type.OUTPUT)));

  addOpsToMap(VedType.DOOR, [].concat(
      opsToAddCluster(1, VedType.DOOR),
      opsToAddPart(2, 1),
      opsToAddJack(3, 2, JackAddress.Type.INPUT)));

  addOpsToMap(VedType.EXIT, [].concat(
      opsToAddCluster(1, VedType.EXIT),
      opsToAddPart(2, 1),
      opsToSetData(2, 'url', '.')));

  addOpsToMap(VedType.GRIP, [].concat(
      opsToAddCluster(1, VedType.GRIP),
      opsToAddPart(2, 1),
      opsToAddJack(3, 2, JackAddress.Type.OUTPUT)));

  addMonoPartCluster(VedType.PLAYER_ASSEMBLER);

  addBiPartCluster(VedType.PORTAL);

  addOpsToMap(VedType.TIMER, [].concat(
      opsToAddCluster(1, VedType.TIMER),
      opsToAddPart(2, 1),
      opsToSetData(2, 'timeout', 100),
      opsToAddJack(3, 2, JackAddress.Type.INPUT),
      opsToAddJack(4, 2, JackAddress.Type.OUTPUT)));

  addBiPartCluster(VedType.WALL);

  addOpsToMap(VedType.ZAPPER, [].concat(
      opsToAddCluster(1, VedType.ZAPPER),
      opsToAddPart(2, 1),
      opsToAddJack(3, 2, JackAddress.Type.INPUT)));

  return map;
};
