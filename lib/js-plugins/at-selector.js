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
    sel = sel ? sel.string : '';

    var selectorsMap = this.__selectorsMap__;

    if (!selectorsMap) {
      var Normalizer = require('stylus/lib/visitor/normalizer')
        , visitor = new Normalizer(this.root.clone());
      try {
        visitor.visit(visitor.root);
      } catch(e) {}

      selectorsMap = visitor.map;
    }

    if(typeof selectorsMap[sel] === 'undefined') return new style.nodes.Object();

    var i, ruleset,
        rulesetList = selectorsMap[sel];
    var props = new style.nodes.Object();

    for(i = rulesetList.length-1; i >= 0; i--) {
      ruleset = rulesetList[i];

      for(j = ruleset.nodes.length-1; j >= 0; j--) {
        var nodes = ruleset.nodes[j].block.nodes;

        nodes.forEach(function(node) {
          if(node.nodeName == 'property'
              && typeof props.vals[node.name] == 'undefined') {
            props.vals[node.name] = node.expr;
          }
        });
      }
    }

    return props;
  });
};

module.exports = {
  plugin: plugin,
}