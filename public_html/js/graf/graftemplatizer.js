/**
 * @param {Array.<GrafTemplate>} templates
 * @constructor
 */
function GrafTemplatizer(templates) {
  this.templates = templates;
  this.map = {};
  for (var i = 0; i < templates.length; i++) {
    var template = templates[i];
    this.map[template.id] = template;
  }
}

/**
 * @param graf
 * @return {Array} Array of param arrays
 */
GrafTemplatizer.prototype.templatize = function(graf) {
  var paramList = [];
  for (var id in graf.clusters) {
    var ops = graf.createClusterOps(id);
    paramList.push(this.createParamsForOps(ops));
  }
  for (var id in graf.links) {
    var ops = graf.createLinkOps(id);
    paramList.push(this.createParamsForOps(ops));
  }
  return paramList;
};

GrafTemplatizer.prototype.detemplatize = function(paramList) {
  var ops = [];
  for (var i = 0; i < paramList.length; i++) {
    var params = paramList[i];
    var template = this.map[params[0]];
    plex.array.extend(ops, template.generateOps(params));
  }
  return ops;
};

GrafTemplatizer.prototype.createParamsForOps = function(ops) {
  for (var i = 0; i < this.templates.length; i++) {
    var params = this.templates[i].getParamsOrNull(ops);
    if (params) {
      return params;
    }
  }
  throw 'no template found for ops ' + JSON.stringify(ops);
};

