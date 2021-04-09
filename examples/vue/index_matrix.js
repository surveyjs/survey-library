function init() {
  var json = {
    questions: [
      {
        type: "matrix",
        name: "Quality",
        title: "Matrix",
        cellType: "checkbox",
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