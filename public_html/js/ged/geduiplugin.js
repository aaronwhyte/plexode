/**
 * App-specific plugin for a GedUi.
 * @constructor
 */
function GedUiPlugin() {
}

/**
 * Called when the model has been altered,
 * which means it's possible the transformed state is stale.
 * This may be called several times between renderings, or
 * zero times. So invalidate the rendered data, and wait for a
 * "render(model)" call before regenerating the app state.
 */
GedUiPlugin.prototype.invalidate = function() {
  throw Error('implement me');
};

/**
 * The Ged rendering loop says its time to draw.
 * @param {GrafModel} grafModel to render.
 */
GedUiPlugin.prototype.render = function(grafModel) {
  throw Error('implement me');
};
