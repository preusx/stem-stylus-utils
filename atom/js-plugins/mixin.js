var utils = require('stylus/lib/utils.js');

var plugin = function(style){

  /**
   * Selector mixin rule.
   *
   * Applying properties from the specified selector ruleset.
   *
   * @param {string} [sel] - Rules selector that you need.
   * @param {boolean} [tree] - Determines whether to insert properties only or
   *   other subsets(groups) too.
   *   Default: false.
   * @param {boolean} [extend] - Determines whether to insert properties of
   *   all the extendables or to use regular extend mechanism instead.
   *   Default: false.
   */

  style.define('mixin', function(sel, tree, extend) {
    var self = this;
    var tree = typeof tree == 'undefined' ? false : tree.val;
    var extend = typeof extend == 'undefined' ? false : extend.val;

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

    if(typeof selectorsMap[sel.string] === 'undefined') return style.nodes.null;

    walker(sel.string, block);

    function walker(selector, block) {
      var i, ruleset,
          rulesetList = selectorsMap[selector];

      for(i = rulesetList.length-1; i >= 0; i--) {
        ruleset = rulesetList[i];

        var nodes = matchedNode(selector, ruleset.nodes).block.nodes;
        var extendables = [];
        var props = [new style.nodes.Null()];

        nodes.forEach(function(node) {
          if(node.nodeName !== 'extend') {
            if(node.nodeName !== 'group' || tree === true) {
              node = node.clone();

              // Inserting the nested block extend properties
              // Dont use tree and extend together.
              //
              // DOESENT WORK PROPERLY YET!
              if(node.nodeName == 'group' && extend === true) {
                node.nodes.forEach(function(nd) {
                  if(nd.nodeName === 'selector') {
                    nd.block.nodes = nd.block.nodes.filter(function(n) {
                      if(n.nodeName === 'extend') {
                        n.selectors.forEach(function(sl) {
                          walker(self.interpolate(sl.clone()).trim(), nd.block);
                        });
                        console.log(nd.block.nodes);

                        return false;
                      }

                      return true;
                    });
                  }
                });
              }

              props.push(node);
            }
          } else if(node.nodeName === 'extend') {
            if(extend === true) {
              node.selectors.forEach(function(sl) {
                extendables.push(self.interpolate(sl.clone()).trim());
              });
            } else {
              self.visitExtend(node);
            }
          }
        });

        self.mixin(props, block);

        if(extend) {
          extendables.forEach(function(sl) {
            walker(sl, block);
          });
        }
      }
    }

    function matchedNode(selector, nodes) {
      var res = nodes.filter(function(node) {
        return selector.trim() == self.interpolate(node).trim();
      })[0];

      return res ? res : nodes[nodes.length - 1];
    }
  });
};

module.exports = {
  plugin: plugin,
}