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
//    if (!(id in VedType)) {
//      throw Error('id ' + id + ' is not in VedType enum');
//    }
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
    addOpsToMap(type,
        opsToAddCluster(1, type)
            .concat(opsToAddPart(2, 1, 0, -Transformer.WALL_RADIUS * 2))
            .concat(opsToAddPart(3, 1, 0, Transformer.WALL_RADIUS * 2)));
  }

  addOpsToMap(VedType.BEAM_SENSOR, opsToAddCluster(1, VedType.BEAM_SENSOR)
      .concat(opsToAddPart(2, 1))
      .concat(opsToAddJack(3, 2, JackAddress.Type.OUTPUT)));

  addMonoPartCluster(VedType.BLOCK);

  addMonoPartCluster(VedType.BUTTON); // TODO jacks

  addOpsToMap(VedType.DOOR, opsToAddCluster(1, VedType.DOOR)
      .concat(opsToAddPart(2, 1))
      .concat(opsToAddJack(3, 2, JackAddress.Type.INPUT)));

  addOpsToMap(VedType.EXIT, opsToAddCluster(1, VedType.EXIT)
      .concat(opsToAddPart(2, 1))
      .concat(opsToSetData(2, 'url', '.')));

  addMonoPartCluster(VedType.GRIP);  // TODO jacks

  addMonoPartCluster(VedType.PLAYER_ASSEMBLER);

  addBiPartCluster(VedType.PORTAL);

  addOpsToMap(VedType.TIMER, opsToAddCluster(1, VedType.TIMER)
      .concat(opsToAddPart(2, 1))
      .concat(opsToSetData(2, 'timeout', 100)));

  addBiPartCluster(VedType.WALL);

  addMonoPartCluster(VedType.ZAPPER);  // TODO jacks


  return map;
};
