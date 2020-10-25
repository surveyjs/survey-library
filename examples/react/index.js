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
    "title": "Hello Dynamic Component Navigation",
    "pages": [
     {
      "name": "page1",
      navigationTitle: "Title 1",
      navigationDescription: "Description 1",
      "elements": [
       {
        "type": "text",
        "name": "question1"
       }
      ]
     },
     {
      "name": "page2",
      navigationTitle: "Title 2",
      navigationDescription: "Description 2",
      "elements": [
       {
        "type": "checkbox",
        "name": "question2",
        "choices": [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
     },
     {
      "name": "page3",
      navigationTitle: "Title 3",
      navigationDescription: "Description 3",
      "elements": [
       {
        "type": "radiogroup",
        "name": "question3",
        "choices": [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
     },
     {
      "name": "page4",
      navigationTitle: "Title 4",
      navigationDescription: "Description 4",
      "elements": [
       {
        "type": "dropdown",
        "name": "question4",
        "choices": [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
     },
     {
      "name": "page5",
      navigationTitle: "Title 5",
      navigationDescription: "Description 5",
      "elements": [
       {
        "type": "comment",
        "name": "question5"
       }
      ]
     },
     {
      "name": "page6",
      navigationTitle: "Title 6",
      navigationDescription: "Description 6",
      "elements": [
       {
        "type": "rating",
        "name": "question6"
       }
      ]
     },
     {
      "name": "page7",
      navigationTitle: "Title 7",
      navigationDescription: "Description 7",
      "elements": [
       {
        "type": "boolean",
        "name": "question7"
       }
      ]
     }
    ],
    "showProgressBar": "top",
    "progressBarType": "hello"
   };

  class SurveyProgressHello extends React.Component {
    render() {
      return React.createElement('div', null, `${this.props.survey.title}`);
    }
  };
  Survey.ReactElementFactory.Instance.registerElement("survey-progress-hello", (props) => {
    return React.createElement(SurveyProgressHello, props);
  });

  Survey.StylesManager.applyTheme("default");
  var model = new Survey.Model(json);
  window.survey = model;

  ReactDOM.render(
    <Survey.Survey model={model} />,
    document.getElementById("surveyElement")
  );
}

if (!window["%hammerhead%"]) {
  init();
}
