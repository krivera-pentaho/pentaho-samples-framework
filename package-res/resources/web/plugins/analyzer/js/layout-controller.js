define(["common-ui/jquery"], function($) {
  var framework, api, listenerToRemove, onResetRenderArea, docURLs;
  var isDebug = location.search.search("debug=true") > -1;
  var viewModeURL = "/pentaho/api/repos/xanalyzer/viewer?catalog=SteelWheels&cube=SteelWheelsSales&autoRefresh=true" + (isDebug ? "&debug=true" : "");
  var editModeURL = "/pentaho/api/repos/xanalyzer/editor?catalog=SteelWheels&cube=SteelWheelsSales&autoRefresh=true&showFieldList=false" + (isDebug ? "&debug=true" : "");
  var currentModeURL = viewModeURL;
  var apiCallsData = {};

  var toggleDocumentation = function() {
    var showDocVal = $("#show-doc").is(":checked");
    framework.showDocumentation(showDocVal);
  };

  var updateContent = function(methodName) {
    var data = apiCallsData[methodName];

    // Update documentation
    framework.replaceDocumentation(data ? data.docHTML : "");

    var apiCallParameters = $("#api-call-parameters .params-container").empty();
    if (data && data.params) {
      $("#api-call-parameters").show();
      $(data.params).each(function(index, param) {
        var paramEle = $("<div class='api-call-param-container'><span></span><select></select></div>");

        var spanEle = paramEle.find("span").text(param.name+": ");

        var selectEle = paramEle.find("select");
        selectEle.attr("id", param.name+"-parameter");
        selectEle.attr("param", param.name);

        $(param.values).each(function(index, value) {
          var option = $("<option></option>").text(value);
          selectEle.append(option);
        });

        selectEle.on("change", function() {
          resetRenderArea();
        });

        apiCallParameters.append(paramEle);
      });
    } else {
      $("#api-call-parameters").hide();
    }

    resetRenderArea();
  }

  var populateAPICalls = function(methodNames) {
    var apiCall = $("#api-call");
    apiCall.empty();
    apiCall.append("<option></option>");

    $("#api-call-parameters").hide();

    $("#additional-content").empty();

    $(methodNames).each(function(index, methodName) {
      var option = $("<option></option>").text(methodName).val(methodName);
      apiCall.append(option);
    });
  };

  var buildAPICallsData = function(html) {
    var tocAnchors = html.find(".article-toc .wiki-toc a");
    var methodNames = [];
    tocAnchors.each(function(index, anchors) {
      if (index == 0) {
        return;
      }
      var methodName = anchors.innerHTML.split(" ")[0];
      
      if(methodName.search("api") > -1) {
        return;
      }

      methodNames.push(methodName);

      var methodHTML = html.find("#method_" + methodName);
      methodHTML.find(".editIcon").remove();
      methodHTML.find(".bar").remove();

      var params;
      methodHTML.find(".param").each(function(index, param) {
        var paramListItems = $(param).find(".param-description li");
        if (paramListItems.length > 0) {
          if (!params) {
            params = [];
          }

          var name = $(param).find("code").text();
          var param = {
            name: name,
            values: []
          }
          
          paramListItems.each(function(index, listItem) {
            param.values.push(listItem.innerText);
          });

          params.push(param);
        }
      });

      apiCallsData[methodName] = {
        docHTML: methodHTML,
        params : params
      };
    });

    return methodNames;
  };

  var loadAPINamespace = function(endpoint) {
    resetRenderArea();
    resetDocArea();

    $("#app-header").text();
    framework.replaceHeader("Analyzer API - " + docURLs[endpoint].text)
    

    // Get Content from MindTouch
    $.ajax({
      url: docURLs[endpoint].url,
      type: "GET",
      success: function(data, status) {
        var html = $(data);

        var methodNames = buildAPICallsData(html);
        populateAPICalls(methodNames);
      },
      error: function() { alert("error") },
      dataType: "html"
    });
  };

  var resetRenderArea = function(keepEditConsole) {
    framework.console.reset(keepEditConsole);
    framework.console.addLine("Press \"Apply\" to execute the api call.");
    framework.console.showEditConsoleButton(false);

    $("#additional-content").empty();

    if (listenerToRemove) {
      listenerToRemove.remove();
      listenerToRemove = null;
    }

    if (onResetRenderArea) {
      onResetRenderArea();
      onResetRenderArea = null;

      return true;
    }

    if(api) {
      api.report.setDatasource("SteelWheels", "SteelWheelsSales");
      api.ui.showFilterPanel(false);

      try {
        api.operation.resetReport(); // Reset report
      } catch(e) {}
    }
  };

  var resetDocArea = function() {
    framework.replaceDocumentation("<h4>Select an API Endpoint to populate this area</h4>");
  };

  var setMode = function(mode) {
    if (mode == "view-mode") {
      currentModeURL = viewModeURL;
      $("#analyzer-frame-overlay").fadeIn(500).find("h1").text("Switching to VIEW mode");
    } else if (mode == "edit-mode") {
      currentModeURL = editModeURL;
      $("#analyzer-frame-overlay").fadeIn(500).find("h1").text("Switching to EDIT mode");
    }

    resetRenderArea();
    disableApply();
    $("#analyzer-frame").attr("src", currentModeURL);
    api = null;
  };

  var refreshAnalyzerFrame = function() {
    disableApply();    
    showOverlay("Refreshing Analyzer");
    $("#analyzer-frame").contents()[0].location.reload();
    api = null;
  };

  var showOverlay = function(msg) {
    $("#analyzer-frame-overlay").fadeIn(500).find("h1").text(msg ? msg : "Executing API Call");
  };
  
  var hideOverlay = function() {
    $("#analyzer-frame-overlay").hide();
  };

  var disableApply = function() {
    $("#apply-api-button").attr("disabled", true);
  };

  var enableApply = function() {
    $("#apply-api-button").attr("disabled", false);
  };

  return {
    resetRenderArea : resetRenderArea,
    resetDocArea : resetDocArea,
    toggleDocumentation : toggleDocumentation,
    updateContent : updateContent,
    loadAPINamespace : loadAPINamespace,
    setMode : setMode,
    refreshAnalyzerFrame : refreshAnalyzerFrame,
    showOverlay : showOverlay,
    hideOverlay : hideOverlay,
    disableApply : disableApply,
    enableApply : enableApply,

    setApi : function(loadedApi) {
      api = loadedApi;
    },
    setListenerToRemove : function(listener) {
      listenerToRemove = listener;
    },
    setOnResetRenderArea : function(f) {
      onResetRenderArea = f;
    },
    init : function(pentahoFramework) {
      framework = pentahoFramework;
      $("#analyzer-frame").attr("src", currentModeURL);
      $("#analyzer-frame").contents().find("#reportContent").css("border", "0px");

      var baseURL = pentahoFramework.getPluginBaseURL();

      docURLs = {
        report : {
          url: baseURL + "content/AnalyzerAPITools/Report APIs - Pentaho Corporation.html",
          text: "Report",
          namespace: "api.report.*"
        },
        operation : {
          url: baseURL + "content/AnalyzerAPITools/Operation APIs - Pentaho Corporation.html",
          text: "Operation",
          namespace: "api.operation.*"
        },
        util : {
          url: baseURL + "content/AnalyzerAPITools/Utility APIs - Pentaho Corporation.html",
          text: "Utility",
          namespace: "api.util.*"
        },
        ui : {
          url: baseURL + "content/AnalyzerAPITools/User Interface APIs - Pentaho Corporation.html",
          text: "User Interface",
          namespace: "api.ui.*"
        },
        event : {
          url: baseURL + "content/AnalyzerAPITools/Event APIs - Pentaho Corporation.html",
          text: "Event",
          namespace: "api.event.*"
        }
      }

      loadAPINamespace("report");
    },
    unload : function() {
      framework = null; 
      api = null;
      listenerToRemove = null;
      apiCallsData = {};
      currentModeURL = viewModeURL;
      docURLs = null;
    }
  }
});