define(["common-ui/jquery-clean", "common-ui/prompting/api/PromptingAPI"], function($, PromptingAPI) {
  var ApiActions = function(framework) {
    this.api = new PromptingAPI();
    this.framework = framework;

    this._getParameterXML = function(callback) {
      var fullURL = this.framework._createFullURL("resources/params.xml");

      $.ajax({
        url: fullURL,
        type: "GET",
        success: function(data, status) {
          if (status == "success") {
            callback(data);
          } else {
            alert("Error loading " + fullURL);
          }
        },
        error: function(msg) { alert(JSON.stringify(msg, null, 2)); },
        dataType: "text"
      });
    };

    this.createPromptPanel = function() {
      this.framework.console.clear();
      this.framework.console.addLine("api.operation.render('prompt-panel-render-area', getParameterXMLCallback);", "'prompt-panel-render-area' is the id of the HTML container.");
      this.api.operation.render("prompt-panel-render-area", function(api, callback) {
        this._getParameterXML(function(xml) {
          callback(xml); // Finish Render

          $("#prompt-panel-render-area").show();
          this.framework.console.addLine("api.operation.init();", "The 'render' call above does not actually create the prompt. 'init' needs to be called after.");
          this.api.operation.init();
        }.bind(this));
      }.bind(this));
    };

    // Use Cases
    this.methods = {
      event: {
        afterRender: function() {

        },
        beforeRender: function() {

        },
        beforeUpdate: function() {

        },
        parameterChanged: function() {

        },
        postInit: function() {

        }
      },

      operation: {
        getParameterValues: function() {

        },
        init: function() {

        },
        render: function() {

        }
      }
    };

    this.execute = function(namespace, method) {
      namespace = namespace.replace("*", "").replace("api.", "");

      var apiFunc = this.methods[namespace + method];

      if (!apiFunc) {
        alert("API definition not found for " + namespace+method);
      }
    };
  };

  return ApiActions;
});
