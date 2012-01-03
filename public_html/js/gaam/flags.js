/**
 * @constructor
 */
function Flags(element) {
  this.element = element;
  this.flags = {};
}

Flags.prototype.elementId = function(name) {
  return 'flag_' + name;
};

Flags.prototype.render = function() {
  var flagNames = [];
  for (var flagName in this.flags) {
    flagNames.push(flagName);
  }
  flagNames.sort();
  var html = [];
  for (var i = 0; i < flagNames.length; i++) {
    var name = flagNames[i];
    var val = this.flags[name];
    var id = this.elementId(name);
    html.push(
        '<input type=checkbox id="', id, '" ',
        (!!val ? 'checked ' : ''),
        '><label for="', id, '">', textToHtml(name), '</label><br>');
  }
  this.element.innerHTML = html.join('');
  for (var i = 0; i < flagNames.length; i++) {
    var name = flagNames[i];
    document.getElementById(this.elementId(name)).onchange = this.createOnChangeFn(name);
  }
};

Flags.prototype.createOnChangeFn = function(name) {
  var id = this.elementId(name);
  var me = this;
  return function() {
    var element = document.getElementById(id);
    me.set(name, element.checked);
  }
};

Flags.NAME_REGEX = /^[a-zA-Z][a-zA-Z_0-9]*$/;

Flags.prototype.addFlag = function(name) {
  if (!Flags.NAME_REGEX.test(name)) {
    throw Error('name "' + name + '" does not match regexp ' + Flags.NAME_REGEX);
  }
  this.flags[name] = null;
};

Flags.prototype.init = function(name, val) {
  val = !!val;
  if (!(name in this.flags)) {
    this.addFlag(name);
    this.flags[name] = val;
    this.render();
  }
};

Flags.prototype.set = function(name, val) {
  val = !!val;
  if (!(name in this.flags)) {
    this.addFlag(name);
  }
  if (this.flags[name] !== val) {
    this.flags[name] = val;
    this.render();
  }
};

Flags.prototype.get = function(name) {
  if (!(name in this.flags)) {
    this.addFlag(name);
    this.render();
  }  
  return this.flags[name];
};