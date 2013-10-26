/**
 * @constructor
 */
function VedTemplateBuilder(id) {
  this.id = id;
  this.ops = [];
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.push = function(op) {
  this.ops.push(op);
  return this;
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.extend = function(ops) {
  plex.array.extend(this.ops, ops);
  return this;
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.cluster = function(type) {
  return this.push({
    type: GrafOp.Type.ADD_CLUSTER,
    id: GrafTemplate.PARAM
  }).data('type', type);
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.data = function(key, value) {
  return this.push({
    type: GrafOp.Type.SET_DATA,
    id: GrafTemplate.AUTO,
    key: key,
    value: value
  });
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.dataParam = function(key) {
  return this.data(key, GrafTemplate.PARAM);
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.part = function() {
  return this.push({
    type: GrafOp.Type.ADD_PART,
    id: GrafTemplate.AUTO,
    clusterId: GrafTemplate.AUTO,
    x: GrafTemplate.PARAM,
    y: GrafTemplate.PARAM
  });
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.jack = function(type, name) {
  return this.push({
    type: GrafOp.Type.ADD_JACK,
    id: GrafTemplate.AUTO,
    partId: GrafTemplate.AUTO
  }).data('type', type).data('name', name);
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.input = function(name) {
  return this.jack(JackAddress.Type.INPUT, name);
};

/**
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.output = function(name) {
  return this.jack(JackAddress.Type.OUTPUT, name);
};

/**
 * @param spriteClass A sprite class whose inputs and outputs will be
 * scraped in order to provide inputs and output jacks in this template.
 * @return {VedTemplateBuilder}
 */
VedTemplateBuilder.prototype.jacks = function(spriteClass) {
  var name, inputs = spriteClass.prototype.inputIds;
  for (name in inputs) {
    this.input(name);
  }
  var outputs = spriteClass.prototype.outputIds;
  for (name in outputs) {
    this.output(name);
  }
  return this;
};

/**
 * @return {GrafTemplate}
 */
VedTemplateBuilder.prototype.build = function() {
  return new GrafTemplate(this.id, this.ops);
};
