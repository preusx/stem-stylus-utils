var plugin = function(style){

  /**
   * Selector at(@) rule.
   *
   * Recieves property values from node block with specified selector.
   *
   * @param {string} [selector] - Block selector.
   * @returns {mixed} - Properties hash or empty hash if cant get.
   */
  style.define('at_selector', function(sel) {

    var block = this.currentBlock;
    if ('group' != block.node.nodeName) block = this.closestGroup;

    var selectorsMap = this.__selectorsMap__;

    if (!selectorsMap) {
      var Normalizer = require('stylus/lib/visitor/normalizer')
        , visitor = new Normalizer(this.root.clone());
      try {
        visitor.visit(visitor.root);
      } catch(e) {}

      selectorsMap = visitor.map;
    }

    if(typeof selectorsMap[sel.string] === 'undefined') return {};

    var i, ruleset,
        rulesetList = selectorsMap[sel.string];
    var props = new style.nodes.Object();

    for(i = rulesetList.length-1; i >= 0; i--) {
      ruleset = rulesetList[i];
      var nodes = ruleset.nodes[0].block.nodes;

      nodes.forEach(function(node) {
        if(node.nodeName == 'property') {
          props.vals[node.name] = node.expr;
        }
      });
    }

    return props;
  });

};

module.exports = {
  plugin: plugin,
}