/**
 * Converts user gestures to GrafStor actions.
 * Maintains UI mode
 * - dragging, linking, editing field, etc.
 * - clipboard (set by app code)
 * - (but selection is really backed by GrafStor's GrafEd).
 *
 * Mutations
 * - Mutates the GrafStor using its high-level action support.
 *
 * Cameraman
 * - pan and zoom
 * - translates gestures into world coords
 *
 * Does the rendering.
 * - Owns the pluggable underlayer, and controls its camera,
 *   state invalidation (retransformation), and rendering calls.
 * - Overlays the graf rendering stuff on top.
 * - Handles key/value input widgets.
 *
 *
 * @param {GrafStor} grafStor
 * @constructor
 */
function GrafUi(grafStor) {
  this.grafStor = grafStor;
}