define(["common-ui/jquery", "common-ui/prompting/api/PromptingAPI", "./doc-panel.js", "./api-actions.js"], function($, PromptingAPI, DocPanel, ApiActions) {

  var PropertiesPanel = function(framework) {

    this.docPanel = new DocPanel(framework);
    this.apiActions = new ApiActions(framework);
    this.framework = framework;

    this._populateMethods = function(clazz) {
      this.docPanel.getMethods(clazz, function(methods) {
        var methodsEle = $("#methods").empty();
        methodsEle.append("<option></option>");
        for (var i = 1; i < methods.length; i++) {
          var method = methods[i];
          var option = $("<option></option>").val(method).text(method);
          methodsEle.append(option);
        }
      });
    };

    this._executeApiAction = function(namespace, method) {

    }

    this.init = function() {
      $("#create-prompt-btn").on("click", function() {
        this.apiActions.createPromptPanel();
      }.bind(this));

      var classesEle = $("#classes").on("change", function(e) {
        this._populateMethods($(e.currentTarget).val());
      }.bind(this));

      this.docPanel.getClasses(function(classes) {
        for (var i = 0; i < 2; i++) {
          var clazz = classes[i];
          var option = $("<option></option>").val(clazz).text("api." + clazz + ".*");
          classesEle.append(option);
        }

        this._populateMethods(classes[0]);
      }.bind(this));

      var methodsEle = $("#methods").on("change", function(e) {
        var ele = $(e.currentTarget);
        this.docPanel.populateDoc(classesEle.val(), ele.val());
      }.bind(this));

      $("#apply-btn").on("click", function() {
        alert("test");
      });
    }
  }

  return PropertiesPanel;
});
