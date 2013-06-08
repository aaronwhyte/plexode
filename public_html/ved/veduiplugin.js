/**
 * @param {Renderer} renderer
 * @extends GedUiPlugin
 * @constructor
 */
function VedUiPlugin(renderer) {
  GedUiPlugin.call(this);
  this.renderer = renderer;
  this.vorp = null;
}
VedUiPlugin.prototype = new GedUiPlugin();
VedUiPlugin.prototype.constructor = VedUiPlugin;

VedUiPlugin.prototype.invalidate = function() {
  this.vorp = null;
};

VedUiPlugin.prototype.render = function(grafModel) {
  if (!this.vorp) {
    this.vorp = this.createVorp(grafModel);
  }
  this.vorp.draw();
};

VedUiPlugin.prototype.createVorp = function(grafModel) {
  // create vorp instance
  var gameClock = new GameClock();
  var sledgeInvalidator = new SledgeInvalidator();
  var vorp = Vorp.createVorp(this.renderer, null, gameClock, sledgeInvalidator);
  vorp.editable = true;
  var transformer = new Transformer(vorp, gameClock, sledgeInvalidator);
  transformer.transformModel(grafModel);

  // Clock twice 'cause the doors require it for some reason.
  // TODO: fix that - only clock once
  vorp.clock();
  vorp.clock();
  return vorp;
};

