define(["common-ui/jquery", "./api-actions.js"], function($, apiActions) {
  var api, layout, framework;

  var addConsoleLines = function(calls, clickable) {
    framework.console.clear(true);

    var currentIndex = calls.length - 1;

    $(calls).each(function(index, call) {
      var altText;
      if (typeof call == "object") {
        altText = call.altText;
        call = call.text;
      } 

      var onclick = function(e) {
        var targetIndex = parseInt($(e.currentTarget).attr("index"));

        var numChanges = currentIndex - targetIndex;
        var historyCall = numChanges > 0 ? api.operation.undo : api.operation.redo;

        for (var i = 0; i < Math.abs(numChanges); i ++) {
          historyCall();
        }

        try{
          api.operation.refreshReport();
        } catch(e) {}

        currentIndex = targetIndex;
      };

      // Add console line
      framework.console.addLine(call, altText, clickable ? onclick : null).attr("index", index);
    });
  };

  var executeAPICall = function(override) {
    var keepEditConsole = override != undefined;
    if (layout.resetRenderArea(keepEditConsole)) {
      return executeAPICall;
    }

    var params = {};
    $(".api-call-param-container select").each(function(index, paramHTML) {
      params[$(paramHTML).attr("param")] = paramHTML.value;
    });

    var postObj = apiActions.execute($("#api-call").val(), api, addConsoleLines, params, override);

    framework.console.showEditConsoleButton(true);

    if (postObj) {
      if (postObj.onResetRenderArea) {
        layout.setOnResetRenderArea(postObj.onResetRenderArea);
      } else if (postObj.listener) { // listener which needs to be removed on next render area reset
        layout.setListenerToRemove(postObj.listener);
      } else { // queued action
        return postObj
      }
    }
  };

  var getEditConsoleContent = function() {
    var apiCall = $("#api-call").val();
    return {
      code: ""+apiActions.actions[apiCall],
      title: apiCall
    }
  }

  var onSubmitEditConsole = function(codeStr) {
    var override = eval("(" + codeStr + ")");
    executeAPICall(override);
  };

  return {
    addConsoleLines : addConsoleLines,
    executeAPICall : executeAPICall,
    init: function(loadedLayout, embedFramework) {
      layout = loadedLayout;
      framework = embedFramework;

      apiActions.init(layout);
      framework.console.getEditContent = getEditConsoleContent;
      framework.console.onSubmit = onSubmitEditConsole;
    },
    setApi: function(loadedApi) {
      api = loadedApi;
    },
    unload : function() {
      api = null;
      layout = null;

      apiActions.unload();
    }
  }
});