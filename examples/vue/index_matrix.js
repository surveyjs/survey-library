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
    questions: [
      {
        type: "matrix",
        name: "Quality",
        title: "Matrix",
        layout: "vertical",
        columns: [
          {
            value: 1,
            text: "Strongly Disagree"
          },
          {
            value: 2,
            text: "Disagree"
          },
          {
            value: 3,
            text: "Neutral"
          },
          {
            value: 4,
            text: "Agree"
          },
          {
            value: 5,
            text: "Strongly Agree"
          }
        ],
        rows: [
          {
            value: "affordable",
            text: "Product is affordable"
          },
          {
            value: "does what it claims",
            text: "Product does what it claims"
          }
        ]
      },
      {
        type: "matrix",
        name: "Quality2",
        title: "Matrix",
        columns: [
          {
            value: 1,
            text: "Strongly Disagree"
          },
          {
            value: 2,
            text: "Disagree"
          },
          {
            value: 3,
            text: "Neutral"
          },
          {
            value: 4,
            text: "Agree"
          },
          {
            value: 5,
            text: "Strongly Agree"
          }
        ],
        rows: [
          {
            value: "affordable",
            text: "Product is affordable"
          },
          {
            value: "does what it claims",
            text: "Product does what it claims"
          }
        ]
      }
    ]
  };


  Survey.StylesManager.applyTheme("default");

  var model = new Survey.Model(json);
  //model.setDesignMode(true);
  window.survey = model;

  var app = new Vue({
    el: "#surveyElement",
    data: {
      survey: model
    }
  });
}

if (!window["%hammerhead%"]) {
  init();
}