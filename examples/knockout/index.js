function init() {
  //Add the price property into choices
  Survey.Serializer.addProperty("itemvalue", "price:number");

  var getItemPrice = function(params) {
    //this.row property available in cells of dropdown and dynamic matrices questions
    var question = !!this.row
      ? this.row.getQuestionByColumnName(params[0])
      : null;
    //if we can't find a question inside the cell (by row and column name) then return
    if (!question) return 0;

    //get the selected item/choice
    var selItem = question.selectedItem;
    //return 0 if a user did not select the item yet.
    return !!selItem ? selItem.price : 0;
  };
  //Register the custom function
  Survey.FunctionFactory.Instance.register("getItemPrice", getItemPrice);

  var json = {
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "paneldynamic",
                    "name": "relatives",
                    "title": "Please enter all blood relatives you know",
                    "renderMode": "list",
                    "templateTitle": "#{panelIndex}. Information about: {panel.relativeType}",
                    "templateElements": [
                        {
                            "name": "relativeType",
                            "type": "dropdown",
                            "title": "Relative",
                            "choices": [
                                "father",
                                "mother",
                                "brother",
                                "sister",
                                "son",
                                "daughter"
                            ],
                            "isRequired": true
                        }, {
                            "name": "isalive",
                            "type": "radiogroup",
                            "title": "Alive?",
                            "startWithNewLine": false,
                            "isRequired": true,
                            "colCount": 0,
                            "choices": ["Yes", "No"]
                        }, {
                            "name": "liveage",
                            "type": "dropdown",
                            "title": "Age",
                            "isRequired": true,
                            "startWithNewLine": false,
                            "visibleIf": "{panel.isalive} = 'Yes'",
                            "choicesMin": 1,
                            "choicesMax": 115
                        }, {
                            "name": "deceasedage",
                            "type": "dropdown",
                            "title": "Deceased Age",
                            "isRequired": true,
                            "startWithNewLine": false,
                            "visibleIf": "{panel.isalive} = 'No'",
                            "choices": [
                                {
                                    "value": -1,
                                    "text": "Unknown"
                                }
                            ],
                            "choicesMin": 1,
                            "choicesMax": 115
                        }, {
                            "name": "causeofdeathknown",
                            "type": "radiogroup",
                            "title": "Cause of Death Known?",
                            "isRequired": true,
                            "colCount": 0,
                            "startWithNewLine": false,
                            "visibleIf": "{panel.isalive} = 'No'",
                            "choices": ["Yes", "No"]
                        }, {
                            "name": "causeofdeath",
                            "type": "text",
                            "title": "Cause of Death",
                            "isRequired": true,
                            "startWithNewLine": false,
                            "visibleIf": "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
                        }, {
                            "type": "panel",
                            "name": "moreInfo",
                            "state": "expanded",
                            "title": "Detail Information about: {panel.relativeType}",
                            "elements": [
                                {type: "text", name: "q1"}
                            ]
                        }
                    ],
                    "panelCount": 2,
                    "panelAddText": "Add a blood relative",
                    "panelRemoveText": "Remove the relative"
                }
            ]
        }
    ]
};


  Survey.StylesManager.applyTheme("defaultV2");
  var model = new Survey.Model(json);
  //model.setDesignMode(true);
  window.survey = model;

  model.onUploadFiles
  .add(function (survey, options) {
      options.callback("success", options.files.map(function (file) {
              return {
                  file: file,
                  content: "https://surveyjs.io/Content/Images/design/Logo.svg"
              };
          }));
  });
  
  model.render("surveyElement");
}

if (!window["%hammerhead%"]) {
  init();
}