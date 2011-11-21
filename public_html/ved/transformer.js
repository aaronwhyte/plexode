/**
 * Creates a Vorp from a VedModel
 * @constructor
 */
function Transformer() {
  this.model = null;
  this.vorp = null;
}

/**
 * @param {VedModel} model  The thing to make a Vorp out of.
 */
Transformer.prototype.transform = function(model) {
  this.vorp = new Vorp();
  this.model = model
};

Transformer.prototype.transform = function(vedModel) {
};
