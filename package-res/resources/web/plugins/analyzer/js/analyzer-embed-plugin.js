define(["common-ui/jquery", "./layout-controller.js", "./execution-controller.js"], function($, layout, execution) {
  var framework;
  var queuedAction = null;

  var onDocumentReady = function() {
    if(!(document.readyState == "interactive" || document.readyState == "complete")) {
      $(document).ready(onDocumentReady);
      return;
    }

    $("#show-doc").on("click", layout.toggleDocumentation);
    
    $("#api-call").on("change", function() {      
      layout.updateContent($(this).val());
    });

    $("[name=mode]").on("change", function() {
      layout.setMode($(this).attr("id"));
    });

    $("#api-namespace").on("change", function() {
      layout.loadAPINamespace($(this).val());
    });

    $("#apply-api-button").on("click", function() {
      queuedAction = execution.executeAPICall();
    });

    layout.init(framework);
    execution.init(layout, framework);
  };

  // Attach onAnalyzerReady to window for Analyzer frame API
  window.onAnalyzerReady = function(api, frameId) {
    layout.setApi(api);
    execution.setApi(api);

    var callback = api.event.registerRenderListener(function(e, api) {
      callback.remove();

      if (queuedAction) {
        setTimeout(function() {
          layout.enableApply();
          layout.hideOverlay();

          queuedAction(api);
          queuedAction = null;
        }, 200);
      } else {
        layout.enableApply();
        layout.hideOverlay();
      }
    });
    
  };

  return {
    init : function(PentahoEmbedFramework) {
      framework = PentahoEmbedFramework;
      var propertiesPanelLoaded = false, renderAreaLoaded = false;

      var allLoaded = function() {
        if (propertiesPanelLoaded && renderAreaLoaded) {
          onDocumentReady();
        }
      };

      var error = function(msg) {
        alert(msg);
      }

      // Load Properties Panel
      framework.loadPropertiesPanel({
        html: "partials/properties-panel.html",
        css: "css/properties-panel.css",
        success: function() {
          propertiesPanelLoaded = true;
          allLoaded();
        },
        error: error
      });

      // Load Render Area
      framework.loadRenderArea({
        html: "partials/render-area.html",
        css: "css/render-area.css",
        success: function() {
          renderAreaLoaded = true;
          allLoaded();
        },
        error: error
      });

      // Load CSS for Documentation panel
      framework.loadDocumentation({
        css: "css/documentation.css"
      });

      framework.showConsole(true);
    },
    unload: function() {
      framework = null;
      queuedAction = null;
      
      layout.unload();
      execution.unload();
    }
  };
});