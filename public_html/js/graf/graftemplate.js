/**
 * @constructor
 */
function GrafTemplate(id, ops) {
  this.id = id;
  this.ops = ops;
}

GrafTemplate.AUTO = '$TEMPLATE-AUTO';
GrafTemplate.PARAM = '$TEMPLATE-PARAM';

/**
 * If the template matches the realOps, then this returns the template array
 * that rebuilds the ops.
 * But if this isn't the right template for these ops, then this returns null.
 * @param {Array.<Object>} realOps
 * @return {Array.<Object>?}
 */
GrafTemplate.prototype.getParamsOrNull = function(realOps) {
  // Generate a list of param values, returning early if there's a clear mismatch.
  if (realOps.length != this.ops.length) return null;
  var params = [this.id];
  for (var i = 0; i < realOps.length; i++) {
    var tOp = this.ops[i], rOp = realOps[i];
    var tKeys = plex.object.keys(tOp);
    var rKeys = plex.object.keys(rOp);
    if (!plex.array.equals(tKeys, rKeys)) {
      console.log('key list mismatch', tKeys, rKeys);
      return null;
    }
    for (var k = 0; k < tKeys.length; k++) {
      var key = tKeys[k];
      var tVal = tOp[key], rVal = rOp[key];
      if (tVal == GrafTemplate.PARAM) {
        params.push(rVal);
      }
    }
  }

  // Create ops using those params.
  // If the created ops match the real ops, we have a winner!
  var genOps = this.generateOps(params);
  if (JSON.stringify(genOps) == JSON.stringify(realOps)) {
    return params;
  } else {
    console.log('genOps != realOps', JSON.stringify(genOps), JSON.stringify(realOps));
    return null;
  }
};

/**
 * @param {Array} params
 * @return {Array.<Object>}
 */
GrafTemplate.prototype.generateOps = function(params) {
  function assertIdSet(id) {
    if (!id) throw 'ID not set';
    return id;
  }
  var genOps = JSON.parse(JSON.stringify(this.ops));
  var op;
  var clusterId, partId, lastId;
  if (params[0] != this.id) {
    throw 'Expected param[0] to be ' + this.id + ' but was ' + params[0];
  }
  var nextParam = 1;
  for (var i = 0; i < genOps.length; i++) {
    op = genOps[i];
    for (var key in op) {
      if (op[key] == GrafTemplate.PARAM) {
        var paramVal = params[nextParam++];
        if (key == 'id' && op.type != GrafOp.Type.SET_DATA) {
          // Only the first op, a cluster or link, can have a param ID.
          if (i != 0) {
            throw 'Only the first op in a template can have a param for an ID. op #' + i + ': ' + JSON.stringify(op);
          }
          lastId = paramVal;
          // Maybe assign the top-level ID
          if (op.type == GrafOp.Type.ADD_CLUSTER) {
            clusterId = paramVal;
          } else if (op.type == GrafOp.Type.ADD_LINK) {
            // no need to track link's ID since links have no sub-objects
          } else {
            throw 'Only an add-cluster or add-link can have a param for an ID. op: ' + JSON.stringify(op);
          }
        }
        // OK, fill in the PARAM value.
        op[key] = paramVal;

      } else if (op[key] == GrafTemplate.AUTO) {
        if (!lastId) {
          throw 'cannot assign an ID automatically when there is no prev ID';
        }
        if (key == 'id' && op.type != GrafOp.Type.SET_DATA) {
          // Assign a new auto-gen ID and remember it.
          lastId++;
          if (op.type == GrafOp.Type.ADD_CLUSTER) {
            clusterId = lastId;
          } else if (op.type == GrafOp.Type.ADD_PART) {
            partId = lastId;
          }
          op[key] = lastId;
        } else if (key == 'clusterId') {
          // addPart to cluster
          op[key] = assertIdSet(clusterId);
        } else if (key == 'partId') {
          // addJack to part
          op[key] = assertIdSet(partId);
        } else if (key == 'id' && op.type == GrafOp.Type.SET_DATA) {
          // setData on something
          op[key] = lastId;
        } else {
          throw 'Cannot AUTO a non-ID field. Op: ' + JSON.stringify(op);
        }
      }
    }
  }
  return genOps;
};
