var plugin = function(){
  return function(style){
    var pluginFiles = [
      'ExtendNode', 'AtRuleTypes',
      'strings', 'regexp', 'math', 'byte-operations',
      'at-current', 'at-selector', 'mixin',
    ];

    for(var i = 0, l = pluginFiles.length; i < l; i++) {
      var fName = pluginFiles[i];

      require('./js-plugins/' + fName).plugin(style);
    }
  };
};

module.exports = plugin;