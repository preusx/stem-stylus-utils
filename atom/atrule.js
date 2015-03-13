var plugin = function(){
  return function(style){
    /**
     * Check current property existance.
     *
     * @param {string} [property] - Property that you need.
     * @returns {bool}
     */
    var atCurrentExists = function(property) {
      return this.nodes.some(function(node) {
        if(node.nodeName == 'property') {
          return node.segments[0].name == property.string;
        }

        return false;
      });
    };

    style.define('at_current_exists', function(property) {
      return atCurrentExists.call(this.closestBlock, property);
    });


    /**
     * Current at(@) rule.
     *
     * Recieves property value from current node block.
     *
     * @param {string} [property] - Property that you need.
     * @returns {mixed} - Value of property or null if cant get.
     */
    var atCurrent = function(property) {
      var nodes = this.nodes, node, i, l;

      for(i = 0, l = nodes.length, node = nodes[i]; i < l; i++) {
        if(node.nodeName == 'property') {
          if(node.segments[0].name == property.string) {
            return node.expr;
          }
        }
      }
      return null;
    };

    style.define('at_current', function(property) {
      return atCurrent.call(this.closestBlock, property);
    });

    /**
     * Selector at(@) rule. Deosent working yet!
     *
     * Recieves property value from node block with specified selector.
     *
     * @param {string} [selector] - Block selector.
     * @param {string} [property] - Property that you need.
     * @returns {mixed} - Value of property or null if cant get.
     */
    var atSelector = function(selector, property) {
      return null;
    };

    style.define('at_selector', function(selector, property) {
      return atSelector.call(this.root, selector, property);
    });
  };
};

module.exports = plugin;