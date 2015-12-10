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

    this.createPromptPanel = function(postInit) {
      this.framework.console.clear();

      if (!postInit) {
        this.framework.console.addLine("api.operation.render('prompt-panel-render-area', getParameterXml);", "'prompt-panel-render-area' is the id of the HTML container.");
      }

      this.api.operation.render("prompt-panel-render-area", function(api, callback) {
        this._getParameterXML(function(xml) {
          callback(xml); // Finish Render
          $("#prompt-panel-render-area").show();

          if (!postInit) {
            this.framework.console.addLine("api.operation.init();", "The 'render' call above does not actually create the prompt. 'init' needs to be called after.");
          }

          this.api.operation.init();

          postInit.call(this);
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
        afterUpdate: function() {

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
          this.createPromptPanel(function() {
            var paramValues = this.api.operation.getParameterValues();
            var paramValuesStr = JSON.stringify(paramValues, null, 2);

            this.framework.console.addLine("api.operation.getParameterValues()");
            this.framework.console.addLine("Return Value:\n" + paramValuesStr);
          });
        },
        init: function() {
          this.createPromptPanel();
        },
        render: function() {
          this.framework.console.addLine("api.operation.render('prompt-panel-render-area', getParameterXml);", "'prompt-panel-render-area' is the id of the HTML container.");
          this.api.operation.render("prompt-panel-render-area", function(api, callback) {
            this._getParameterXML(function(xml) {
              callback(xml); // Finish Render

              this.framework.console.addLine("Nothing is shown, but the prompt panel render area is ready to be initialized");
            }.bind(this));
          }.bind(this));
        }
      }
    };

    this.execute = function(namespace, method) {
      if (!method) {
        return;
      }

      var apiFunc = this.methods[namespace][method];

      if (!apiFunc) {
        alert("API definition not found for " + namespace+method);
      } else {
        apiFunc.bind(this).call();
      }
    };
  };

  return ApiActions;
});
