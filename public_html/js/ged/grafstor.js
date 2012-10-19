/**
 * GrafStor wraps an OpStor and adds mad value for clients. It's meant to be used by UIs.
 *
 * State:
 * - Maintains a GrafModel throughout all op changes from the client and from stor events.
 *
 * Queries:
 * - Provides the GrafModel (read-only, honor system) to clients.
 * - Handles spacial queries, like "get closest thing".
 *
 * Notification:
 * - PubSub says when the model changed due to another tab or something.
 *
 * Mutations:
 * - Handles high-level operations like drag, copy/paste, link, edit field, etc,
 *   so the UI never has to worry about operations.
 * - Stages continuous-preview mutations like dragging, without flooding LocalStorage with changes.
 * @param {OpStor} opStor  a Stor of GrafOps
 * @param {GrafEd} grafEd  contains the GrafModel
 * @constructor
 */
function GrafStor(opStor, grafEd) {
  this.opStor = opStor;
  this.grafEd = grafEd;
}

/**
 * @return {GrafModel} The graf itself.  Don't edit it! It's the internal one, not a copy.
 * It's meant to be iterated over during rendering.
 */
GrafStor.prototype.getModel = function() {
  return this.grafEd.getModel();
};


