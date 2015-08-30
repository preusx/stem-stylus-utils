/**
 * Reassign
 * ======================================================================== */
var utils = require('stylus/lib/utils.js');

var variableFrameLookup = function(name, first) {
  var i = this.stack.length - 1,
      frame = this.stack[i],
      first = typeof first == 'undefined' ? true : false,
      find = i,
      val;

  do {
    frame = this.stack[i];

    if (frame && (val = frame.lookup(name))) {
      find = i;
      if(first) break;
    }
  } while(i--);

  return this.stack[find];
};

var blockFrameLookup = function(paternity) {
  var i = 0, l = this.stack.length - 1,
      paternity = typeof paternity == 'undefined' ? true : paternity,
      frame;

  if(l < paternity) return;

  if(paternity === true) {
    do {
      frame = this.stack[l];

      if(frame.block.nodeName == 'root') return frame;

      if (frame.block.node && (frame.block.node.nodeName == 'group')) {
        return frame;
      }
    } while(l--);
  }

  do {
    frame = this.stack[l - i];
    i++;

    if(frame.block.node) {
      paternity--;
    }
  } while(paternity >= 0 && l - i >= 0);

  if(paternity <= 0) {
    return this.stack[l - i + 1];
  }
}


var plugin = function(style) {
  var reassign, assign, lookup;

  (reassign = function(name, expr) {
    utils.assertType(name, 'string', 'name');
    var scope = variableFrameLookup.call(this, name.val, false).scope;

    if(!scope) {
      throw new Error('There is no variable called: "' + name.val + '"');
    }

    var node = new style.nodes.Ident(name.val, expr);
    scope.add(node);

    return style.nodes.null;
  });

  style.define('reassign', reassign);

  (assign = function(name, expr, paternity) {
    utils.assertType(name, 'string', 'name');
    var i = this.stack.length - 1
        frame = blockFrameLookup.call(this, paternity.val);

    if(!frame) {
      throw new Error('The value(' + paternity.val + ') of the paterninty is too big!');
    }

    var scope = frame.scope;

    var node = new style.nodes.Ident(name.val, expr);
    scope.add(node);

    return style.nodes.null;
  });

  style.define('assign', assign);

  (lookup = function(name) {
    utils.assertType(name, 'string', 'name');
    var scope = variableFrameLookup.call(this, name.val).scope;

    return scope.lookup(name.val);
  });

  style.define('lookup', lookup);
  style.define('var', lookup);
};


module.exports = {
  plugin: plugin,
  variableFrameLookup: variableFrameLookup,
  blockFrameLookup: blockFrameLookup,
}