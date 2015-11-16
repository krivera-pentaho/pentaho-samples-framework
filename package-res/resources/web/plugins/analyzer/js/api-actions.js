define(["common-ui/jquery"], function($) {
  var timeForRender = 1500;
  var layout;

  /*
   * api.report.*
   */
  var actions = {
    addLayoutField: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0 );
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1 );
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      addConsoleLines([
        'api.report.addLayoutField( "rows", "[Markets].[City]", 0 )',
        'api.report.addLayoutField( "rows", "[Markets].[Territory]", 1 )',
        'api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 )'
      ], true);
    },
    buildCellActionContext: function(api, addConsoleLines) {
      var callback = api.event.registerRenderListener(function(e, api, reportArea) {
        callback.remove();

        var td = $(reportArea).find("[type=cell][rowindex=0]")[0];
        var cellCtx = api.report.buildCellActionContext(td);
        cellCtx = JSON.stringify(cellCtx, null, 2);

        addConsoleLines([
          {
            text:"api.report.buildCellActionContext(td)",
            altText: "The 'td' cell is the Quantity measure in the first row"
          },
          "Return Value: " + cellCtx
        ]);
      });

      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0 );
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.operation.refreshReport(); // Cause render to happen
    },
    buildFilterActionContext: function(api, addConsoleLines) {
      var callback = api.event.registerRenderListener(function(e, api, reportArea) {
        callback.remove();

        var filterCtx = api.report.buildFilterActionContext();
        filterCtx = JSON.stringify(filterCtx, null, 2);

        addConsoleLines([
          "api.report.buildFilterActionContext()", // The call must be made after render
          "Return Value: " + filterCtx
        ]);
      });

      api.report.addLayoutField( "rows", "[Markets].[City]", 0 );
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1 );
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setFilters("[Markets].[Territory]", [{"operator":"EQUAL","members":[{"formula":"[Markets].[APAC]","caption":"APAC"}]}]);
      api.operation.refreshReport(); // Cause render to happen
    },
    getChartOption: function(api, addConsoleLines, params) {
      api.report.setVizId("ccc_bar");
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var altText = this._setChartOption(params.name, api).altText;

      var chartOption = JSON.stringify(api.report.getChartOption(params.name));
      var nameParam = JSON.stringify(params.name);
      var msg = "Return Value: " + chartOption;

      if (chartOption == null) {
        altText = "\"null\" values indicate that this option is not set"
      }

      addConsoleLines(["api.report.getChartOption(" +  nameParam + ")",
        altText ? { text: msg, altText: altText } : msg
      ]);
    },
    getFieldOption: function(api, addConsoleLines, params) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.addLayoutField( "measures", "[Measures].[Sales]", 0 );

      var execution = this._setFieldOption(params.name, api);

      var fieldOption = api.report.getFieldOption(execution.formula, params.name);
      var msg = "Return Value: \"" + fieldOption + "\"";
      if (fieldOption == null) {
        execution.altText = "\"null\" values indicate that this option is not available for the type of attribute represented by the formula";
      }

      addConsoleLines([
        "api.report.getFieldOption(\"" + execution.formula + "\", \"" + params.name + "\");",
        execution.altText ? { text: msg, altText: execution.altText } : msg
      ]);
    },
    getFilters: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setFilters("[Markets].[Territory]", [{"operator":"EQUAL","members":[{"formula":"[Markets].[EMEA]","caption":"EMEA"},{"formula":"[Markets].[Japan]","caption":"Japan"}]}]);
      api.report.setFilters("[Markets].[Country]", [{"operator":"NOT_EQUAL","members":[{"formula":"[Markets].[EMEA].[Ireland]","caption":"Ireland"}]}]);
      api.ui.showFilterPanel(true);

      var filters = api.report.getFilters();

      addConsoleLines([
        "api.report.getFilters();",
        "Return Value: " + JSON.stringify(filters, null, 2)
      ]);
    },
    getLayoutFields: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var rows = api.report.getLayoutFields("rows");
      var columns = api.report.getLayoutFields("columns");
      var measures = api.report.getLayoutFields("measures");

      addConsoleLines([
        "api.report.getLayoutFields(\"rows\")",
        "Return Value: " + JSON.stringify(rows), "",
        "api.report.getLayoutFields(\"columns\")",
        "Return Value: " + JSON.stringify(columns), "",
        "api.report.getLayoutFields(\"measures\")",
        "Return Value: " + JSON.stringify(measures)
      ]);
    },
    getName: function(api, addConsoleLines) {
      var name = api.report.getName();

      addConsoleLines([
        "api.report.getName();",
        {
          text: "Return Value: " + name,
          altText: "Returns null if the report is unsaved."
        }
      ]);

    },
    getNumericFilters: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.ui.showFilterPanel(true);
      api.report.setNumericFilters("[Markets].[Country]", [{"count":"10","formula":"[Measures].[Quantity]","operator":"TOP"},{"operator":"GREATER_THAN","formula":"[Measures].[Quantity]","op1":"200"}]);

      var filters = JSON.stringify(api.report.getNumericFilters(), null, 2);

      addConsoleLines([
        "api.report.getNumericFilters();",
        "Return Value: " + filters
      ]);
    },
    getPath: function(api, addConsoleLines) {
      var path = api.report.getPath();

      addConsoleLines([
        "api.report.getPath();",
        {
          text: "Return Value: " + path,
          altText: "Returns null if the report is unsaved."
        }
      ]);
    },
    getReportOption: function(api, addConsoleLines, params) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0 );
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var reportOption = JSON.stringify(api.report.getReportOption(params.name));

      addConsoleLines([
        "api.report.getReportOption(\"" + params.name + "\")",
        "Return Value: " + reportOption
      ]);
    },
    getVizId: function(api, addConsoleLines) {
      var vizId = JSON.stringify(api.report.getVizId());

      addConsoleLines([
        "api.report.getVizId();",
        "Return Value: " + vizId
      ]);
    },
    isDirty: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0 );
      api.report.removeLayoutField( "rows", "[Markets].[City]");
      api.report.addLayoutField( "rows", "[Markets].[City]", 0 );

      addConsoleLines([
        "No Op\napi.report.isDirty()\nReturn Value: false",
        "api.report.addLayoutField( \"rows\", \"[Markets].[City]\", 0 )\napi.report.isDirty()\nReturn Value: true"
      ], true);
    },
    isNew: function(api, addConsoleLines) {
      var isNew = api.report.isNew();
      addConsoleLines([
        "api.report.isNew()",
        "Return Value: " + isNew
      ]);
    },
    removeFilters: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setFilters("[Markets].[Territory]", [{"operator":"EQUAL","members":[{"formula":"[Markets].[EMEA]","caption":"EMEA"},{"formula":"[Markets].[Japan]","caption":"Japan"}]}]);

      this._delayCall(function() {
        api.report.removeFilters("[Markets].[Territory]");
        api.ui.showFilterPanel(true);
        addConsoleLines([
          "api.report.setFilters(\"[Markets].[Territory]\", ...);",
          "api.report.removeFilters(\"[Markets].[Territory]\");"
        ], true);
      });
    },
    removeLayoutField: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0 );

      this._delayCall(function() {
        api.report.removeLayoutField( "rows", "[Markets].[City]");

        addConsoleLines([
          "api.report.addLayoutField( \"rows\", \"[Markets].[City]\", 0 );",
          "api.report.removeLayoutField( \"rows\", \"[Markets].[City]\");"
        ], true);
      });
    },
    setChartOption: function(api, addConsoleLines, params) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      api.report.setVizId("ccc_scatter");
      api.report.addLayoutField( "y", "[Measures].[Sales]", 0 );

      var that = this;
      this._delayCall(function() {
        var execution = that._setChartOption(params.name, api);
        api.operation.refreshReport();

        var msg = "api.report.setChartOption(" + JSON.stringify(params.name) + ", " + JSON.stringify(execution.value) + ");";
        addConsoleLines([
          execution.altText ? { text: msg, altText: execution.altText } : msg
        ]);
      });
    },
    setDatasource: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      this._delayCall(function() {
        api.report.setDatasource("SampleData", "Quadrant Analysis");
        api.report.addLayoutField( "rows", "[Department].[Department]", 0 );
        api.report.addLayoutField( "measures", "[Measures].[Actual]", 0 );

        addConsoleLines([
          "api.report.setDatasource(\"SampleData\", \"Quadrant Analysis\");"
        ]);
      });
    },
    setFieldLink: function(api, addConsoleLines) {
      api.event.registerRenderListener(function() {
        api.report.setFieldLink("[Markets].[Territory]", function(api, ctx, filterCtx) {
          alert("Set Field Link: " + JSON.stringify(ctx));
        });

        addConsoleLines([
          "api.report.setFieldLink(\"[Markets].[Territory]\", function(api, ctx, filterCtx) {" +
          "\n  alert(\"Set Field Link: \" + JSON.stringify(ctx));" +
          "\n});"
        ]);
      });

      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0 );

      return {
        onResetRenderArea : layout.refreshAnalyzerFrame
      }
    },
    removeNumericFilters: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setNumericFilters("[Markets].[Country]", [{"count":"10","formula":"[Measures].[Quantity]","operator":"TOP"},{"operator":"GREATER_THAN","formula":"[Measures].[Quantity]","op1":"200"}]);
      api.report.removeNumericFilters();
      api.ui.showFilterPanel(true);

      var filters = JSON.stringify(api.report.getNumericFilters(), null, 2);

      addConsoleLines([
        "api.report.setNumericFilters(\"[Markets].[Country]\", ...);",
        "api.report.removeNumericFilters();"
      ], true);
    },
    setFieldOption: function(api, addConsoleLines, params) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.addLayoutField( "measures", "[Measures].[Sales]", 0 );

      var that = this;
      this._delayCall(function() {
        var execution = that._setFieldOption(params.name, api);
        api.operation.refreshReport();

        var msg = "api.report.setFieldOption(" + JSON.stringify(execution.formula) + ", " + JSON.stringify(params.name) + ", " + JSON.stringify(execution.value) + ");";
        addConsoleLines([
          execution.altText ? { text: msg, altText: execution.altText } : msg
        ]);
      });
    },
    setFilters: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setFilters("[Markets].[Territory]", [{"operator":"EQUAL","members":[{"formula":"[Markets].[EMEA]","caption":"EMEA"},{"formula":"[Markets].[Japan]","caption":"Japan"}]}]);
      api.ui.showFilterPanel(true);

      addConsoleLines([
        "api.report.setFilters(\"[Markets].[Territory]\", [{\"operator\":\"EQUAL\",\"members\":[{\"formula\":\"[Markets].[EMEA]\",\"caption\":\"EMEA\"},{\"formula\":\"[Markets].[Japan]\",\"caption\":\"Japan\"}]}]);"
      ])
    },
    setLayoutFields: function(api, addConsoleLines) {
      api.report.setLayoutFields("rows", ["[Markets].[Territory]", "[Markets].[Country]"]);

      addConsoleLines([
        "api.report.setLayoutFields(\"rows\", [\"[Markets].[Territory]\", \"[Markets].[Country]\"]);"
      ]);
    },
    setNumericFilters: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Country]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setNumericFilters("[Markets].[Country]", [{"count":"10","formula":"[Measures].[Quantity]","operator":"TOP"},{"operator":"GREATER_THAN","formula":"[Measures].[Quantity]","op1":"200"}]);
      api.ui.showFilterPanel(true);

      addConsoleLines([
        "api.report.setNumericFilters(\"[Markets].[Country]\", [{\"count\":\"10\",\"formula\":\"[Measures].[Quantity]\",\"operator\":\"TOP\"},{\"operator\":\"GREATER_THAN\",\"formula\":\"[Measures].[Quantity]\",\"op1\":\"200\"}]);"
      ]);
    },
    setReportOption: function(api, addConsoleLines, params) {
      var value = "";
      var altText;
      var consoleLine;
      var additionalCall;
      api.report.addLayoutField( "columns", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      switch(params.name) {
        case "showRowGrandTotal":
          value = "true";
          break;
        case "showColumnGrandTotal":
          value = "true";
          break;
        case "useNonVisualTotals":
          value = "true";
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set \"showColumnGrandTotal\" or \"showColumnGrandTotal\" to \"true\"";
          break;
        case "showEmptyCells":
          value = "true";
          break;
        case "showDrillLinks":
          value = "true";
          break;
        case "autoRefresh":
          value = "false";
          consoleLine = "api.report.setLayoutFields(\"columns\", [\"[Markets].[City]\"]);"

          additionalCall = function() {
            api.report.setLayoutFields("columns", ["[Markets].[City]"]);
          }
          break;
        case "freezeColumns":
          api.report.addLayoutField( "columns", "[Markets].[City]", 0);
          value = "false";
          consoleLine = "Click and drag the table to see the unfrozen columns";
          break;
        case "freezeRows":
          api.report.addLayoutField( "rows", "[Product].[Line]", 0);
          value = "false";
          consoleLine = "Click and drag the table to see the unfrozen rows";
          break;
      }

      this._delayCall(function() {
        api.report.setReportOption(params.name, value);
        api.operation.refreshReport();

        if(additionalCall) {
          additionalCall();
        }

        var msg = "api.report.setFieldOption(" + JSON.stringify(params.name) + ", " + JSON.stringify(value) + ");";
        addConsoleLines([
          altText ? { text: msg, altText: altText } : msg,
          consoleLine ? consoleLine : ""
        ]);
      });
    },
    setVizId: function(api, addConsoleLines, params) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      api.report.setVizId(params.vizId);

      if (params.vizId == "ccc_scatter") {
        api.report.addLayoutField( "y", "[Measures].[Sales]", 0);
      }

      addConsoleLines(["api.report.setVizId(" + JSON.stringify(params.vizId) + ");"]);
    },

    /*
     * api.operation.*
     */
    clearCache: function(api, addConsoleLines) {
      addConsoleLines([
        "var successCallback = function() { alert(\"Cache has been cleared successfully\"); }" +
        "\nvar failureCallback = function() { alert(\"Failed attempting to clear cache\"); }",
        "api.operation.clearCache(successCallback, failureCallback, true);"
      ]);

      api.operation.clearCache(function() {
        alert("Cache has been cleared successfully");
      }, function() {
        alert("Failed attempting to clear cache");
      }, true);
    },
    clearDropTargetIndicator: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);

      var x = 400, y = 115, formula = "[Markets].[City]";
      var dropTarget = api.operation.getDropTarget(x, y, formula);
      api.operation.showDropTargetIndicator(dropTarget);

      var that = this;
      this._delayCall(function() {
        api.operation.clearDropTargetIndicator(dropTarget);

        addConsoleLines([
          "var dropTarget = api.operation.getDropTarget(" + x + ", " + y + ", " + JSON.stringify(formula) + ");",
          "api.operation.showDropTargetIndicator(dropTarget);",
          "api.operation.clearDropTargetIndicator(dropTarget);"
        ]);
      });
    },
    completeDrop: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);

      var x = 400, y = 115, formula = "[Markets].[City]";
      var dropTarget = api.operation.getDropTarget(x, y, formula);

      var that = this;
      this._delayCall(function() {
        that._addDraggableElements(api, addConsoleLines);

        api.operation.completeDrop(dropTarget);

        addConsoleLines([
          "var dropTarget = api.operation.getDropTarget(" + x + ", " + y + ", " + JSON.stringify(formula) + ");",
          "api.operation.completeDrop(dropTarget)"
        ]);
      });
    },
    getDropTarget: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);


      var x = 400, y = 115, formula = "[Markets].[City]";
      var dropTarget = api.operation.getDropTarget(x, y, formula);

      this._addDraggableElements(api, addConsoleLines);

      addConsoleLines([
        "api.operation.getDropTarget(" + x + ", " + y + ", " + JSON.stringify(formula) + ");",
        "Return Value: {\n\"source\": " + JSON.stringify(dropTarget.source, null, 2) + "\n\"target\": { ... }"+ "\n}"
      ]);
    },
    redo: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.operation.undo();
      api.operation.redo();

      addConsoleLines([
        "api.report.addLayoutField( \"rows\", \"[Markets].[Territory]\", 0); \napi.operation.undo()",
        {
          text: "api.operation.redo();",
          altText: "redo() requires that undo() is performed first"
        }
      ], true);
    },
    refreshReport: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0);
      api.operation.refreshReport();

      addConsoleLines([
        {
          text: "api.operation.refreshReport();",
          altText: "None of the api calls execute refreshReport() for the user, therefore many expected UI elements will not be drawn until refreshReport() is called."
        }
      ]);
    },
    resetReport: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0);
      api.report.removeLayoutField( "rows", "[Markets].[City]");

      addConsoleLines([
        "api.report.addLayoutField( \"rows\", \"[Markets].[City]\", 0);",
        "api.operation.resetReport();"
      ], true);
    },
    saveReport: function(api, addConsoleLines) {
      var fileName = "AnalyzerDemo", path = "/home/admin";
      addConsoleLines([
        "var successCallback = function() { alert(\"Report saved successfully\"); }" +
        "\nvar failureCallback = function() { alert(\"Failed attempting to save\"); }",
        "api.operation.saveReport(" + JSON.stringify(fileName) + ", " + JSON.stringify(path) + ", successCallback, failureCallback, true);"
      ]);

      api.operation.saveReport(fileName, path,
          function() {
            alert("Report saved successfully");
          }, function() {
            alert("Failed attempting to save");
          }, true);
    },
    showDropTargetIndicator: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);

      var x = 400, y = 115, formula = "[Markets].[City]";
      var dropTarget = api.operation.getDropTarget(x, y, formula);
      api.operation.showDropTargetIndicator(dropTarget);

      addConsoleLines([
        "var dropTarget = api.operation.getDropTarget(" + x + ", " + y + ", " + JSON.stringify(formula) + ");",
        "api.operation.showDropTargetIndicator(dropTarget);"
      ]);

      return {
        onResetRenderArea : function() {
          api.operation.clearDropTargetIndicator(dropTarget);
        }
      };
    },
    undo: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.removeLayoutField( "rows", "[Markets].[Territory]");

      addConsoleLines([
        "api.report.addLayoutField( \"rows\", \"[Markets].[Territory]\", 1);",
        "api.operation.undo();"
      ], true);
    },

    /*
     * api.event.*
     */
    registerActionEventListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[City]", 0);
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);

      var call = "api.event.registerActionEventListener(function(e, api, actionCode, actionCtx) { ... });";

      addConsoleLines([
        call,
        "Drag UI elements to a different location or trash to see output of registered listener"
      ]);

      return {
        listener : api.event.registerActionEventListener(function(e, api, actionCode, actionCtx) {
          addConsoleLines([
            call,
            "Message: Action event callback executed with action code " + JSON.stringify(actionCode) + (actionCtx.formula ? " for " + JSON.stringify(actionCtx.formula) : "")
          ]);
        })
      }
    },
    registerBuildMenuListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);

      var call = "api.event.registerBuildMenuListener(function(e, api, menuId, menu, x, y) { ... });"
      addConsoleLines([
        call,
        "Right click on table headers or open menus to see output of registered listener"
      ]);

      return {
        listener : api.event.registerBuildMenuListener(function(e, api, menuId, menu, x, y) {
          addConsoleLines([
            call,
            "Message: Build menu callback executed! with menu id = " + JSON.stringify(menuId)
          ]);
        })
      }
    },
    registerChartDoubleClickListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setVizId("ccc_bar");

      var call = "api.event.registerChartDoubleClickListener(function(e, api, ctx) { ... });";
      addConsoleLines([
        call,
        "Double click on chart items to see output of registered listener"
      ]);

      return {
        listener : api.event.registerChartDoubleClickListener(function(e, api, ctx) {
          addConsoleLines([
            call,
            "Chart double click callback executed on " + JSON.stringify(ctx, null, 2)
          ]);
        })
      }
    },
    registerChartSelectItemsListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 0);
      api.report.addLayoutField( "columns", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
      api.report.setVizId("ccc_barnormalized");

      var call = "api.event.registerChartSelectItemsListener(function(e, api, ctxs) { ... });";
      addConsoleLines([
        call,
        "Click on or select chart items to see output of registered listener"
      ]);

      return {
        listener : api.event.registerChartSelectItemsListener(function(e, api, ctxs) {
          addConsoleLines([
            call,
            "Chart selection items callback executed for " + JSON.stringify(ctxs, null, 2)
          ]);
        })
      }
    },
    registerDragEventListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerDragEventListener(function(e, api, formula) { ... });";
      addConsoleLines([
        "api.event.registerDragEventListener(listener);",
        "Drag a UI element to see output of registered listener"
      ]);

      return {
        listener : api.event.registerDragEventListener(function(e, api, formula) {
          addConsoleLines([
            call,
            "Drag event callback executed for " + formula
          ]);
        })
      }
    },
    registerDropEventListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerDropEventListener(function(e, api, formula, dropClass) { ... });";
      addConsoleLines([
        call,
        "Drag then drop a UI element to see output of registered listener"
      ]);

      return {
        listener : api.event.registerDropEventListener(function(e, api, formula, dropClass) {
          addConsoleLines([
            call,
            "Drop event callback executed for " + JSON.stringify(formula) + " on " + JSON.stringify(dropClass)]);
        })
      }
    },
    registerInitListener: function(api, addConsoleLines) {
      var call = "api.event.registerInitListener(function(e, cv) { ... });";
      addConsoleLines([ call ]);

      alert("Init callback executed");
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
    },
    registerPostExecutionListener: function(api, addConsoleLines) {
      var call = "api.event.registerPostExecutionListener(function(e, api, message) { ... });";
      addConsoleLines([
        call
      ]);

      this._delayCall(function() {
        api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
        api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
        api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
        api.operation.refreshReport();
      });

      return {
        listener : api.event.registerPostExecutionListener(function(e, api, message) {
          addConsoleLines([
            call,
            "Post execution callback executed with message: " + JSON.stringify(message, null, 2)
          ]);
        })
      }
    },
    registerPreExecutionListener: function(api, addConsoleLines) {
      var call = "api.event.registerPreExecutionListener(function(e, api) { ... });";
      addConsoleLines([
        call
      ]);

      this._delayCall(function() {
        api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
        api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
        api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
        api.operation.refreshReport();
      });

      return {
        listener : api.event.registerPreExecutionListener(function(e, api) {
          addConsoleLines([
            call,
            "Pre execution callback executed!"
          ]);
        })
      }
    },
    registerRenderListener: function(api, addConsoleLines) {
      var call = "api.event.registerRenderListener(function(e, api, reportArea) { ... });";
      addConsoleLines([
        call
      ]);

      this._delayCall(function() {
        api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
        api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
        api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );
        api.operation.refreshReport();
      });

      var postAPICallRender = false;
      return {
        listener : api.event.registerRenderListener(function(e, api, reportArea) {
          addConsoleLines([
            call,
            postAPICallRender ? "Render callback executed" : ""
          ]);
          postAPICallRender = true;
        })
      }
    },
    registerTableClickListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerTableClickListener(function(e, api, td, ctx, filterCtx) { ... });";
      addConsoleLines([
        call,
        "Left click on table cells to see output of registered listener"
      ]);

      return {
        listener : api.event.registerTableClickListener(function(e, api, td, ctx, filterCtx) {
          var type = td.getAttribute("type");
          addConsoleLines([
            call,
            "Table cell clicked for " + JSON.stringify(ctx, null, 2) + " with type = " + JSON.stringify(type)
          ]);
        })
      }
    },
    registerTableContextMenuListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerTableContextMenuListener(function(e, api, td, ctx, filterCtx) { ... });";
      addConsoleLines([
        call,
        "Right click on table cells to see output of registered listener"
      ]);

      return {
        listener : api.event.registerTableContextMenuListener(function(e, api, td, ctx, filterCtx) {
          var type = td.getAttribute("type");
          addConsoleLines([
            call,
            "Table context menu callback executed for " + JSON.stringify(ctx, null, 2) + " with type = " + JSON.stringify(type)
          ]);
        })
      }
    },
    registerTableDoubleClickListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerTableDoubleClickListener(function(e, api, td, ctx, filterCtx) { ... });";
      addConsoleLines([
        call,
        "Double click on table cells to see output of registered listener"
      ]);

      return {
        listener : api.event.registerTableDoubleClickListener(function(e, api, td, ctx, filterCtx) {
          var type = td.getAttribute("type");
          addConsoleLines([
            call,
            "Table double click cell callback executed for " + JSON.stringify(ctx, null, 2) + " with type = " + JSON.stringify(type)
          ]);
        })
      }
    },
    registerTableMouseMoveListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerTableMouseMoveListener(function(e, api, td, ctx, filterCtx) { ... });";
      addConsoleLines([
        call,
        "Move mouse over table cells to see output of registered listener"
      ]);

      var calls = 0;
      var lastMessage = "";
      return {
        listener : api.event.registerTableMouseMoveListener(function(e, api, td, ctx, filterCtx) {
          var type = td.getAttribute("type");
          var message = "Mouse move for " + JSON.stringify(ctx, null, 2) + " with type = " + JSON.stringify(type);

          if (message === lastMessage) {
            calls++;
          } else {
            calls = 0;
          }

          addConsoleLines([
            call,
            "(Calls In Cell: " + calls +") " + message
          ]);

          lastMessage = message;
        })
      }
    },
    registerTableMouseOverListener: function(api, addConsoleLines) {
      api.report.addLayoutField( "rows", "[Markets].[Territory]", 1);
      api.report.addLayoutField( "rows", "[Order Status].[Type]", 0);
      api.report.addLayoutField( "measures", "[Measures].[Quantity]", 0 );

      var call = "api.event.registerTableMouseOverListener(function(e, api, td, ctx, filterCtx) { ... });";
      addConsoleLines([
        call,
        "Right click on table headers or open menus to see output of registered listener"
      ]);

      return {
        listener : api.event.registerTableMouseOverListener(function(e, api, td, ctx, filterCtx) {
          var type = td.getAttribute("type");
          addConsoleLines([
            call,
            "Mouse over for " + JSON.stringify(ctx, null, 2) + " with type = " + JSON.stringify(type)
          ]);
        })
      }
    },

    /*
     * api.ui.*
     */
    disableFilterPanel: function(api, addConsoleLines) {
      // return this._performUIRemove("EDIT", api.ui.disableFilterPanel, "disableFilterPanel", api, addConsoleLines );
      this._delayCall(function() {
        api.ui.disableFilterPanel();
      });

      return {
        onResetRenderArea : layout.refreshReport
      }
    },
    getMode: function(api, addConsoleLines) {
      var mode = api.ui.getMode();
      addConsoleLines([
        "api.ui.getMode();",
        "Return Value: " + JSON.stringify(mode)
      ]);
    },
    listGembarIds: function(api, addConsoleLines) {
      var gembarIds = api.ui.listGembarIds();

      addConsoleLines([
        "api.ui.listGembarIds();",
        "Return Value: " + JSON.stringify(gembarIds)
      ]);
    },
    listVizIds: function(api, addConsoleLines) {
      var vizIds = api.ui.listVizIds();

      addConsoleLines([
        "api.ui.listVizIds();",
        "Return Value: " + JSON.stringify(vizIds)
      ]);

      layout.setOnResetRenderArea(layout.refreshAnalyzerFrame);
    },
    removeFieldLayout: function(api, addConsoleLines) {
      return this._performUIRemove("EDIT", api.ui.removeFieldLayout, "removeFieldLayout", api, addConsoleLines, true );
    },
    removeFieldList: function(api, addConsoleLines) {
      return this._performUIRemove("EDIT", api.ui.removeFieldList, "removeFieldList", api, addConsoleLines, true );
    },
    removeHeaderBar: function(api, addConsoleLines) {
      return this._performUIRemove("EDIT", api.ui.removeHeaderBar, "removeHeaderBar", api, addConsoleLines );
    },
    removeMainToolbar: function(api, addConsoleLines) {
      return this._performUIRemove("EDIT", api.ui.removeMainToolbar, "removeMainToolbar", api, addConsoleLines );
    },
    removeRedoButton: function(api, addConsoleLines) {
      return this._performUIRemove("EDIT", api.ui.removeRedoButton, "removeRedoButton", api, addConsoleLines );
    },
    removeReportActions: function(api, addConsoleLines) {
      return this._performUIRemove("VIEW", api.ui.removeReportActions, "removeReportActions", api, addConsoleLines );
    },
    removeUndoButton: function(api, addConsoleLines) {
      return this._performUIRemove("EDIT", api.ui.removeUndoButton, "removeUndoButton", api, addConsoleLines );
    },
    setFieldListView: function(api, addConsoleLines, params) {
      if (api.ui.getMode() == "VIEW") {
        this._switchToEditMode();
        addConsoleLines(["Switching to EDIT mode"]);
        var that = this;
        return function(api) {
          that.setFieldListView(api, addConsoleLines, params);
        };
      }

      api.ui.showFieldList(true);
      api.ui.showFieldLayout(false);
      api.ui.setFieldListView(params.view);

      addConsoleLines([
        "api.ui.setFieldListView(" + JSON.stringify(params.view) + ");"
      ]);

      layout.setOnResetRenderArea(layout.refreshAnalyzerFrame);
    },
    showFieldLayout: function(api, addConsoleLines) {
      return this._performShowUI(api.ui.showFieldLayout, "showFieldLayout", api, addConsoleLines, true);
    },
    showFieldList: function(api, addConsoleLines) {
      return this._performShowUI(api.ui.showFieldList, "showFieldList", api, addConsoleLines, true);
    },
    showFilterPanel: function(api, addConsoleLines) {
      api.ui.showFilterPanel(true);
      addConsoleLines([
        "api.ui.showFilterPanel(true);"
      ]);
    },
    showRepositoryButtons: function(api, addConsoleLines) {
      return this._performShowUI(api.ui.showRepositoryButtons, "showRepositoryButtons", api, addConsoleLines);
    },

    /*
     * api.util.*
     */
    parseMDXExpression: function(api, addConsoleLines) {
      var parse = api.util.parseMDXExpression("[Product].[Truck]");

      addConsoleLines([
        "api.util.parseMDXExpression(\"[Product].[Truck]\")",
        "Return Value: " + JSON.stringify(parse)
      ]);

    },

    _switchToEditMode: function(api, addConsoleLines) {
      $("#edit-mode").click();
    },
    _switchToViewMode: function() {
      $("#view-mode").click();
    },
    _postReloadFrame: function() {
      layout.disableApply();
      $("#analyzer-frame")[0].contentDocument.location.reload(true);

      return true;
    },
    _performUIRemove: function(mode, f, s, api, addConsoleLines, showFieldList, skipModeCheck) {

      if (!skipModeCheck) {
        var that = this;

        if (api.ui.getMode() != mode) {
          if (mode == "VIEW") {
            this._switchToViewMode();
          } else if (mode == "EDIT") {
            this._switchToEditMode();
          }

          addConsoleLines([]);

          return function(api) {
            that._performUIRemove(mode, f, s, api, addConsoleLines, showFieldList, true);
          };
        } else {
          this._postReloadFrame();
          layout.showOverlay("Refreshing DOM Elements");
          return function(api) {
            that._performUIRemove(mode, f, s, api, addConsoleLines, showFieldList, true);
          };
        }
      }

      if (showFieldList) {
        api.ui.showFieldList(true);
        api.ui.showFieldLayout(true);
      }

      this._delayCall(function() {
        var f = eval("(api.ui." + s +")");
        f.call(api.ui);

        addConsoleLines([
          {
            text: "api.ui." + s + "();",
            altText: "Since the elements are removed completely from the DOM, the frame must be reloaded to retrieve those items"
          }
        ]);
      });

      layout.setOnResetRenderArea(layout.refreshAnalyzerFrame);
    },
    _performShowUI: function(f, s, api, addConsoleLines, showFieldList) {
      if (api.ui.getMode() == "VIEW") {
        this._switchToEditMode();
        addConsoleLines([]);
        var that = this;
        return function(newApi) {
          that._performShowUI(f, s, newApi, addConsoleLines, showFieldList);
        };
      }

      if (showFieldList) {
        api.ui.showFieldList(true);
        api.ui.showFieldLayout(true);
      }

      this._delayCall(function() {
        var f = eval("(api.ui." + s +")");
        f.call(api.ui, s == "showRepositoryButtons");

        addConsoleLines([
          "api.ui." + s + "(true);"
        ]);
      });

      layout.setOnResetRenderArea(layout.refreshAnalyzerFrame);
    },
    _delayCall: function(f) {
      layout.disableApply();
      layout.showOverlay();

      var that = this;
      setTimeout(function() {
        f.call(f);
        layout.enableApply();
        layout.hideOverlay();
      }, timeForRender);
    },
    _addDraggableElements : function(api, addConsoleLines) {
      var levelsContainer = $("<div class='draggable-container'></div>")
          .append(this._createDraggable("[Markets].[Territory]", "level", api, addConsoleLines))
          .append(this._createDraggable("[Markets].[Country]", "level", api, addConsoleLines))
          .append(this._createDraggable("[Markets].[City]", "level", api, addConsoleLines))
          .append(this._createDraggable("[Product].[Line]", "level", api, addConsoleLines))
          .append(this._createDraggable("[Product].[Vendor]", "level", api, addConsoleLines))
          .append(this._createDraggable("[Product].[Product]", "level", api, addConsoleLines))


      var measuresContainer = $("<div class='draggable-container'></div>")
          .append(this._createDraggable("[Measures].[Quantity]", "measure", api, addConsoleLines))
          .append(this._createDraggable("[Measures].[Sales]", "measure", api, addConsoleLines));

      $("#additional-content")
          .empty()
          .append("<hr />")
          .append("<h5>Levels</h5>")
          .append(levelsContainer)
          .append("<h5>Measures</h5>")
          .append(measuresContainer);
    },
    _createDraggable: function(formula, type, api, addConsoleLines) {
      var draggable = $("<div class='draggable-attribute'></div>")
          .addClass(type)
          .attr("formula", formula)
          .text(api.util.parseMDXExpression(formula));

      var startDrag, dragEle, frameOffset = $("#analyzer-frame").offset(), dragOffset, padding = 10;
      var onIFrameMouseMove = function(e) {
        var x = frameOffset.left + e.clientX - $(window).scrollLeft();
        var y = frameOffset.top + e.clientY - $(window).scrollTop();
        moveDraggable(e, x, y);
      };
      var onDocumentMouseMove = function(e) {
        moveDraggable(e, e.clientX, e.clientY);
      };

      /*
       * Start Drag
       */
      var startDragging = function(e) {
        startDrag = e;
        dragOffset = draggable.position();
        draggable.css("position", "absolute"); // position outside of container
        draggable.css("z-index", 1); // make z-index larger than other draggables

        draggable.css("left", dragOffset.left + startDrag.offsetX + padding);
        draggable.css("top", dragOffset.top + startDrag.offsetY + padding);

        $("body").addClass("no-select"); // Disable text-highlighting

        // Draggable in iFrame
        $("#analyzer-frame").contents()
            .on("mousemove", onIFrameMouseMove)
            .on("mouseup", resetDraggable);

        // Draggable in body
        $(document)
            .on("mousemove", onDocumentMouseMove)
            .on("mouseup", resetDraggable);
      };

      /*
       * Drag
       */
      var lastDropTarget = null;
      var moveDraggable = function(e, x, y) {
        if (!startDrag) {
          return;
        }

        // Calculate offset positions
        var left = x - startDrag.clientX + dragOffset.left + startDrag.offsetX + padding;
        var top = y - startDrag.clientY + dragOffset.top + startDrag.offsetY + padding;

        // Set positions
        draggable.css("left", left);
        draggable.css("top", top);

        var dropX = draggable.offset().left - frameOffset.left - padding;
        var dropY = draggable.offset().top - frameOffset.top - padding;

        /*
         * API Drop Code
         */
        var dropTarget = api.operation.getDropTarget(dropX, dropY, formula);

        addConsoleLines([
          "api.operation.getDropTarget(" + dropX + ", " + dropY + ", " + JSON.stringify(formula) + ")",
          "Return Value: " + (dropTarget ? "{\n\"source\": " + JSON.stringify(dropTarget.source, null, 2) + "\n\"target\": { ... }"+ "\n}" : "null")
        ]);

        if (dropTarget) {
          api.operation.showDropTargetIndicator(dropTarget);

          if (lastDropTarget) {
            var dropTargetId = dropTarget.target.dropTarget.node.id;
            var lastDropTargetId = lastDropTarget.target.dropTarget.node.id;

            if (dropTargetId != lastDropTargetId) {
              api.operation.clearDropTargetIndicator(lastDropTarget);
            }
          }
        } else if (lastDropTarget) {
          api.operation.clearDropTargetIndicator(lastDropTarget);
        }

        lastDropTarget = dropTarget;
      };

      /*
       * Stop Drag
       */
      var resetDraggable = function(e) {
        if (!startDrag) {
          return;
        }

        draggable.css("position", "relative"); // reset to relative positioning

        if (lastDropTarget) {
          api.operation.clearDropTargetIndicator(lastDropTarget);
          api.operation.completeDrop(lastDropTarget);
        }

        draggable.css("z-index", 0); // reset z-index

        $("body").removeClass("no-select"); // Allow text selection

        // Remove listeners to extra elements
        $("#analyzer-frame")
            .off("mousemove", onIFrameMouseMove)
            .off("mouseup", resetDraggable);
        $(document)
            .off("mousemove", onDocumentMouseMove)
            .off("mouseup", resetDraggable);

        // Reset draggable position
        draggable.css("left", 0);
        draggable.css("top", 0);

        // Restart drag object
        startDrag = null;
      };

      draggable
          .on("mousedown", startDragging)
          .on("mousemove", function(e) {
            moveDraggable(e, e.clientX, e.clientY);
          })
          .on("mouseup", resetDraggable);

      return draggable;
    },
    _setChartOption: function(name, api) {
      var altText;
      var value;
      switch(name) {
        case "legendPosition":
          value = "TOP"
          api.report.setVizId("ccc_bar");
          break;
        case "showLegend":
          value = "false";
          api.report.setVizId("ccc_bar");
          break;
        case "autoRange":
          value = "false";

          altText = "Requires that you also set \"valueAxisLowerLimit\" and \"valueAxisUpperLimit\"";
          api.report.setChartOption("valueAxisLowerLimit", "10");
          api.report.setChartOption("valueAxisUpperLimit", "10000");
          break;
        case "valueAxisLowerLimit":
          value = "10";
          altText = "Requires that you also set \"autoRange\"=\"false\" and \"valueAxisUpperLimit\"";

          api.report.setChartOption("autoRange", "false");
          api.report.setChartOption("valueAxisUpperLimit", "10000");
          break;
        case "valueAxisUpperLimit":
          value = "10000";

          altText = "Requires that you also set \"autoRange\"=\"false\" and \"valueAxisLowerLimit\"";
          api.report.setChartOption("autoRange", "false");
          api.report.setChartOption("valueAxisLowerLimit", "10");
          break;
        case "displayUnits":
          value = "UNITS_3";
          altText = "\"UNITS_3\" = Quantity - Thousands";
          break;
        case "autoRangeSecondary":
          value = "false";
          altText = "Requires that you also set \"valueAxisLowerLimitSecondary\" and \"valueAxisUpperLimitSecondary\"";
          api.report.setChartOption("valueAxisLowerLimitSecondary", "1000");
          api.report.setChartOption("valueAxisUpperLimitSecondary", "200000");
          break;
        case "valueAxisLowerLimitSecondary":
          value = "1000";
          altText = "Requires that you also set \"autoRangeSecondary\"=\"false\" and \"valueAxisUpperLimitSecondary\"";
          api.report.setChartOption("autoRangeSecondary", "false");
          api.report.setChartOption("valueAxisUpperLimitSecondary", "200000");
          break;
        case "valueAxisUpperLimitSecondary":
          value = "200000";
          altText = "Requires that you also set \"autoRangeSecondary\"=\"false\" and \"valueAxisLowerLimitSecondary\"";
          api.report.setChartOption("autoRangeSecondary", "false");
          api.report.setChartOption("valueAxisLowerLimitSecondary", "1000");
          break;
        case "displayUnitsSecondary":
          value = "UNITS_3";
          altText = "\"UNITS_3\" = Quantity - Thousands";
          break;
        case "maxValues":
          value = "200";
          break;
        case "backgroundColor":
          value = "#c1d7e1";
          api.report.setChartOption("backgroundFill", "SOLID");
          altText = "Requires that you set \"backgroundFill\" to either \"SOLID\" or \"GRADIENT\"";
          break;
        case "labelColor":
          value = "#c1d7e1";
          break;
        case "labelSize":
          value = "18";
          break;
        case "backgroundFill":
          value = "SOLID";
          api.report.setChartOption("backgroundColor", "#c1d7e1");
          altText = "Requires that you set \"backgroundColor\"";
          break;
        case "maxChartsPerRow":
          api.report.setVizId("ccc_pie");
          value="2";
          break;
        case "multiChartRangeScope":
          api.report.setVizId("ccc_pie");
          value = "CELL";
          break;
        case "emptyCellMode":
          api.report.setChartOption("autoRange", "false");
          api.report.setChartOption("valueAxisLowerLimit", "0");
          api.report.setChartOption("valueAxisUpperLimit", "1000");
          api.report.setVizId("ccc_line");
          value = "ZERO";
          break;
        case "sizeByNegativesMode":
          api.report.setChartOption("autoRange", "false");
          api.report.setChartOption("valueAxisLowerLimit", "-1000");
          api.report.setChartOption("valueAxisUpperLimit", "1000");
          api.report.setVizId("ccc_line");
          value="USE_ABS";
          break;
        case "backgroundColorEnd":
          value = "#000000";
          api.report.setChartOption("backgroundColor", "#c1d7e1");
          api.report.setChartOption("backgroundFill", "GRADIENT");
          altText = "Requires that you set \"backgroundFill\" to \"GRADIENT\" and \"backgroundColor\"";
          break;
        case "labelStyle":
          value="BOLD";
          break;
        case "legendBackgroundColor":
          value = "#c1d7e1";
          break;
        case "legendSize":
          value="18";
          break;
        case "legendColor":
          value = "#c1d7e1";
          break;
        case "legendStyle":
          value="BOLD";
          break;
        case "labelFontFamily":
          value="Times New Roman";
          break;
        case "legendFontFamily":
          value="Times New Roman";
          break;
      }
      api.report.setChartOption(name, value);
      return { altText: altText, value: value };
    },
    _setFieldOption: function(name, api) {
      var formula = "[Markets].[Territory]";
      var value, altText;
      switch(name) {
        case "label":
          value = "TEST_LABEL";
          altText = "Label is the Column Header which is the name element if it is set through the UI."
          break;
        case "sortOrderEnum":
          value="DESC";
          break;
        case "showAggregate":
          formula="[Measures].[Quantity]";
          value="true";
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set Report Option \"showColumnGrandTotal\" to \"true\"";
          break;
        case "showSum":
          formula="[Measures].[Quantity]";
          value="true";
          api.report.setFieldOption("[Measures].[Quantity]", "showSum", "false");
          api.report.setFieldOption("[Measures].[Sales]", "showSum", "false");
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set Report Option \"showColumnGrandTotal\" to \"true\"";
          break;
        case "showAverage":
          formula="[Measures].[Quantity]";
          value="true";
          api.report.setFieldOption("[Measures].[Quantity]", "showSum", "false");
          api.report.setFieldOption("[Measures].[Sales]", "showSum", "false");
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set Report Option \"showColumnGrandTotal\" to \"true\"";
          break;
        case "showMin":
          formula="[Measures].[Quantity]";
          value="true";
          api.report.setFieldOption("[Measures].[Quantity]", "showSum", "false");
          api.report.setFieldOption("[Measures].[Sales]", "showSum", "false");
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set Report Option \"showColumnGrandTotal\" to \"true\"";
          break;
        case "showMax":
          formula="[Measures].[Quantity]";
          value="true";
          api.report.setFieldOption("[Measures].[Quantity]", "showSum", "false");
          api.report.setFieldOption("[Measures].[Sales]", "showSum", "false");
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set Report Option \"showColumnGrandTotal\" to \"true\"";
          break;
        case "showSubtotal":
          formula="[Measures].[Quantity]";
          value = "true"
          api.report.setFieldOption("[Measures].[Quantity]", "showSum", "false");
          api.report.setFieldOption("[Measures].[Sales]", "showSum", "false");
          api.report.setReportOption("showColumnGrandTotal", "true");
          altText = "Requires that you set Report Option \"showColumnGrandTotal\" to \"true\"";
          break;
        case "formatShortcut":
          formula="[Measures].[Quantity]";
          value = "DATA_BAR_RED";
          break;
        case "formatCategory":
          value = "Currency ($)";
          formula = "[Measures].[Sales]";
          break;
        case "formatScale":
          value = "6";
          formula = "[Measures].[Sales]";
          api.report.setFieldOption("[Measures].[Sales]", "formatCategory", "Currency ($)");
          altText = "Requires that you set \"formatCategory\" to \"Currency ($)\"";
          break;
        case "formatExpression":
          formula = "[Measures].[Quantity]";
          value="\nCase\n"+
          "  When [Measures].CurrentMember > 0\n"+
          "  Then '|#,##0|arrow=up'\n"+
          "  When [Measures].CurrentMember < 0\n"+
          "  Then '|#,##0|arrow=down'\n"+
          "  Else '|#,##0'\n"+
          "End\n";
          api.report.setFieldOption("[Measures].[Quantity]", "formatCategory", "Expression");
          altText = "Requires that you set \"formatCategory\" to \"Expression\"";
          break;
        case "currencySymbol":
          value = "#"
          api.report.setFieldOption("[Measures].[Sales]", "formatCategory", "Currency ($)");
          formula = "[Measures].[Sales]";
          altText = "Requires that you set \"formatCategory\" to \"Currency ($)\"";
          break;
      }
      api.report.setFieldOption(formula, name, value);

      return { altText : altText, value : value, formula : formula };
    }
  };

  return {
    actions: actions,
    execute : function(methodName, api, addConsoleLines, params, override) {
      if (methodName && api) {
        try{
          api.operation.resetReport(); // Reset Report to start fresh    
        } catch(e) {}


        var calls = override ? override.call(actions, api, addConsoleLines, params) : 
          actions[methodName].call(actions, api, addConsoleLines, params);

        try {
          api.operation.refreshReport(); // Show all results of executions  
        } catch(e) {}

        return calls;
      }
    },
    init : function(loadedLayout) {
      layout = loadedLayout;
    },
    unload : function() {
      layout = null;
    }
  }
});