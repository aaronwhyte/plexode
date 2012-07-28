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

  function addOpsToMap(id, ops) {
    var graf = new GrafModel();
    graf.applyOps(ops);
    map.set(id, graf);
  }

  addOpsToMap(VedType.WALL,
      opsToAddCluster(1, VedType.WALL)
          .concat(opsToAddPart(2, 1, 0, -Transformer.WALL_RADIUS * 2))
          .concat(opsToAddPart(3, 1, 0, Transformer.WALL_RADIUS * 2)));

  addOpsToMap(VedType.PLAYER_ASSEMBLER,
      opsToAddCluster(1, VedType.PLAYER_ASSEMBLER)
          .concat(opsToAddPart(2, 1))
  );

  return map;
};
