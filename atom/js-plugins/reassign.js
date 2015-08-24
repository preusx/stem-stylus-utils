/**
 * Reassign
 * ======================================================================== */
var utils = require('stylus/lib/utils.js');

var variableScopeLookup = function(name) {
  var i = this.stack.length - 1,
      frame = this.stack[i],
      val;

  do {
    frame = this.stack[i];
    if (frame && (val = frame.lookup(name))) {
      return frame.scope;
    }
  } while(i--);
}


var plugin = function(style) {
  var reassign;

  reassign = function(name, expr) {
    utils.assertType(name, 'string', 'name');
    var scope = variableScopeLookup.call(this, name.val);

    if(!scope) {
      throw new Error('There is no variable called: "' + name.val + '"');
    }

    var node = new style.nodes.Ident(name.val, expr);
    scope.add(node);

    return style.nodes.null;
  };

  style.define('reassign', reassign);
};


module.exports = {
  plugin: plugin,
  variableScopeLookup: variableScopeLookup,
}