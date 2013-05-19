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
 * @param {plex.Map} idToGraf map from ved type name to graf op JSON for that clip
 * @return {ClipList}
 */
VedSysClipListBuilder.createFromMap = function(idToGraf) {
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
VedSysClipListBuilder.createDefaultDataMap = function() {
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

  function opToSetData(id, key, value) {
    return {
      type: GrafOp.Type.SET_DATA,
      id: id,
      key: key,
      value: value,
      oldValue: undefined
    };
  }

  function opsToAddJack(jackId, partId, type, name) {
    return [
      {
        type: GrafOp.Type.ADD_JACK,
        id: jackId,
        partId: partId
      },
      opToSetData(jackId, 'type', type),
      opToSetData(jackId, 'name', name)
    ];
  }

  function opsToAddJacks(partId, spriteClass) {
    var ops = [];
    var jackId = 100; // sure, why not.

    var inputs = spriteClass.prototype.inputIds;
    for (var name in inputs) {
      ops = ops.concat(opsToAddJack(jackId++, partId, JackAddress.Type.INPUT, name));
    }
    var outputs = spriteClass.prototype.outputIds;
    for (var name in outputs) {
      ops = ops.concat(opsToAddJack(jackId++, partId, JackAddress.Type.OUTPUT, name));
    }
    return ops;
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
        opsToAddPart(2, 1, -Transformer.WALL_RADIUS * 1.5, 0),
        opsToAddPart(3, 1, Transformer.WALL_RADIUS * 1.5, 0)));
  }

  addOpsToMap(VedType.BEAM_SENSOR, [].concat(
      opsToAddCluster(1, VedType.BEAM_SENSOR),
      opsToAddPart(2, 1),
      opsToAddJacks(2, BeamerSprite)));

  addMonoPartCluster(VedType.BIG_BLOCK);

  addMonoPartCluster(VedType.BLOCK);

  addOpsToMap(VedType.BUTTON, [].concat(
      opsToAddCluster(1, VedType.BUTTON),
      opsToAddPart(2, 1),
      opsToAddJacks(2, ButtonSprite)));

  addOpsToMap(VedType.DOOR, [].concat(
      opsToAddCluster(1, VedType.DOOR),
      opsToAddPart(2, 1),
      opsToAddJacks(2, DoorControlSprite)));

  addOpsToMap(VedType.EXIT, [].concat(
      opsToAddCluster(1, VedType.EXIT),
      opsToAddPart(2, 1),
      opToSetData(2, 'url', '.')));

  addOpsToMap(VedType.GRIP, [].concat(
      opsToAddCluster(1, VedType.GRIP),
      opsToAddPart(2, 1),
      opsToAddJacks(2, GripSprite)));

  addOpsToMap(VedType.NOT, [].concat(
      opsToAddCluster(1, VedType.NOT),
      opsToAddPart(2, 1),
      opsToAddJacks(2, NotSprite)));

  addMonoPartCluster(VedType.PLAYER_ASSEMBLER);

  addBiPartCluster(VedType.PORTAL);

  addOpsToMap(VedType.TIMER, [].concat(
      opsToAddCluster(1, VedType.TIMER),
      opsToAddPart(2, 1),
      opToSetData(2, 'timeout', 100),
      opsToAddJacks(2, TimerSprite)));

  addOpsToMap(VedType.TOGGLE, [].concat(
      opsToAddCluster(1, VedType.TOGGLE),
      opsToAddPart(2, 1),
      opsToAddJacks(2, ToggleSprite)));

  addBiPartCluster(VedType.WALL);

  addOpsToMap(VedType.ZAPPER, [].concat(
      opsToAddCluster(1, VedType.ZAPPER),
      opsToAddPart(2, 1),
      opsToAddJacks(2, ZapperControlSprite)));

  addMonoPartCluster(VedType.ZOMBIE);

  addMonoPartCluster(VedType.ZOMBIE_ASSEMBLER);

  addOpsToMap(VedType.ANTI_ZOMBIE_TURRET, [].concat(
      opsToAddCluster(1, VedType.ANTI_ZOMBIE_TURRET),
      opsToAddPart(2, 1)));

  return map;
};
