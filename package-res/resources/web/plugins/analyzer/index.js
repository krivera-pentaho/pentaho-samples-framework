define([], function() {
  var plugin;
  return {
    name : "Analyzer Embed",
    init : function(framework) {
      var pluginUrl = framework.getPluginBaseURL() + "/js/analyzer-embed-plugin.js"; 
      require([pluginUrl], function(analyzerEmbedPlugin) {
        plugin = analyzerEmbedPlugin;
        plugin.init(framework);
      });
    },
    unload : function(framework) {
      plugin.unload(framework);
    }
  }
});