
/**
 * This class is just a namespace for static values and methods.
 * A real Graf operation is JSON, like so:
 *
 * { type:"addCluster",  id: 1 }
 * { type:"removeCluster", id:1 }
 *
 * { type:"addPart", id:2, clusterId:1, x:10, y:10 }
 * { type:“movePart", id:2, oldX:10, oldY:10, x:20, y:20}
 * { type:“removePart", id:2, clusterId:1, x:20, y:20 }
 *
 * { type:"addJack", id:3, partId:2 }
 * { type:"removeJack", id:3, partId:2 }
 *
 * { type:"addLink", id:5, jackId1:3, jackId2:4}
 * { type:"removeLink", id:5, jackId1:3, jackId2:4}
 *
 * Every instance of the object types above has its own key/value store.
 * Use "setData" ops to update those stores.  Set a value as undefined to erase
 * it.
 * { type:"setData", id:2, key:"color", oldValue:undefined, value:"red" }
 * { type:"setData", id:2, key:"color", oldValue:"red", value:"blue" }
 * { type:"setData", id:2, key:"color", oldValue:"blue", value:undefined }
 */
function GrafOp() {}

/**
 * @enum {string}
 */
GrafOp.Type = {
  ADD_CLUSTER: 'addCluster',
  REMOVE_CLUSTER: 'removeCluster',
  ADD_PART: 'addPart',
  MOVE_PART: 'movePart',
  REMOVE_PART: 'removePart',
  ADD_JACK: 'addJack',
  REMOVE_JACK: 'removeJack',
  ADD_LINK: 'addLink',
  REMOVE_LINK: 'removeLink',
  SET_DATA: 'setData'
};

GrafOp.isAddOpType = function(type) {
  return type == GrafOp.Type.ADD_CLUSTER ||
      type == GrafOp.Type.ADD_PART ||
      type == GrafOp.Type.ADD_JACK;
};

/**
 * Create a list of ops that will reverse the input list.
 */
GrafOp.createReverses = function(ops) {
  var reverses = [];
  for (var i = ops.length - 1; i >= 0; i--) {
    reverses.push(GrafOp.createReverse(ops[i]));
  }
  return reverses;
};

/**
 * Create the reverse of a single op.
 */
GrafOp.createReverse = function(op) {
  if (!op) throw Error('cannot reverse falsy op: ' + op);
  switch(op['type']) {
    case GrafOp.Type.ADD_CLUSTER:
      return {
        'type': GrafOp.Type.REMOVE_CLUSTER,
        'id': op['id']
      };
    case GrafOp.Type.REMOVE_CLUSTER:
      return {
        'type': GrafOp.Type.ADD_CLUSTER,
        'id': op['id']
      };
    case GrafOp.Type.ADD_PART:
      return {
        'type': GrafOp.Type.REMOVE_PART,
        'id': op['id'],
        'clusterId': op['clusterId'],
        'x': op['x'],
        'y': op['y']
      };
    case GrafOp.Type.REMOVE_PART:
      return {
        'type': GrafOp.Type.ADD_PART,
        'id': op['id'],
        'clusterId': op['clusterId'],
        'x': op['x'],
        'y': op['y']
      };
    case GrafOp.Type.MOVE_PART:
      return {
        'type': GrafOp.Type.MOVE_PART,
        'id': op['id'],
        'x': op['oldX'],
        'y': op['oldY'],
        'oldX': op['x'],
        'oldY': op['y']
      };
    case GrafOp.Type.ADD_JACK:
      return {
        'type': GrafOp.Type.REMOVE_JACK,
        'id': op['id'],
        'partId': op['partId']
      };
    case GrafOp.Type.REMOVE_JACK:
      return {
        'type': GrafOp.Type.ADD_JACK,
        'id': op['id'],
        'partId': op['partId']
      };
    case GrafOp.Type.ADD_LINK:
      return {
        'type': GrafOp.Type.REMOVE_LINK,
        'id': op['id'],
        'jackId1': op['jackId1'],
        'jackId2': op['jackId2']
      };
    case GrafOp.Type.REMOVE_LINK:
      return {
        'type': GrafOp.Type.ADD_LINK,
        'id': op['id'],
        'jackId1': op['jackId1'],
        'jackId2': op['jackId2']
      };
    case GrafOp.Type.SET_DATA:
      return {
        'type': GrafOp.Type.SET_DATA,
        'id': op['id'],
        'key': op['key'],
        'value': op['oldValue'],
        'oldValue': op['value']
      };
    default:
      throw Error('cannot reverse op: ' + expose(op));
  }
};
