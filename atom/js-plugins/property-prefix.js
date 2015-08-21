var plugin = function(style){
  /**
   * Property prefix.
   */
  require('./AtRuleTypes').atRuleTypes.register('p', function(atrule) {
    var b = this.currentBlock;
    var block = atrule.block.clone();
    block.nodes = block.nodes.filter(function(e) {
        return e.nodeName == 'property';
      });

    for(var i = 0, l = block.nodes.length; i < l; i++) {
      block.nodes[i].segments = [].concat(atrule.segments,
        [new style.nodes.Literal('-')], block.nodes[i].segments);
    }

    this.mixin(block.nodes, b);

    return style.nodes.null;
  });
};

module.exports = {
  plugin: plugin,
}