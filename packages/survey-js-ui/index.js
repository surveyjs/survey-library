//Add the price property into choices
Survey.Serializer.addProperty("itemvalue", "price:number");

var getItemPrice = function (params) {
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
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: false,
          "showPreviewBeforeComplete": true,
          elements: [{
            "type": "matrixdropdown",
            "name": "question1",
            "title": "Users",
            "columns": [
              { "name": "Column 1", "title": "Name" },
              { "name": "Column 2", "title": "Email" },
              { "name": "Column 3", "title": "Role" }
            ],
            "detailElements": [
              {
                "type": "text",
                "name": "question3",
                "title": "Phone"
              },
              {
                "type": "text",
                "name": "question4",
                "title": "Department"
              }
            ],
            "detailPanelMode": "underRow",
            "cellType": "text",
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }]
        };

window.survey = new Survey.Model(json);
survey.onComplete.add(function (result) {
  document.querySelector("#surveyResultElement").innerHTML =
        "result: " + JSON.stringify(result.data);
});


window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("surveyElement");
const shadowRoot = container.attachShadow({ mode: 'open' });
const rootElement = document.createElement("div");
rootElement.style.position = "fixed";
rootElement.style.left = "0";
rootElement.style.top = "0";
rootElement.style.right = "0";
rootElement.style.bottom = "0"; 
const surveyStyles = document.createElement('link');
surveyStyles.setAttribute('rel', 'stylesheet');
surveyStyles.setAttribute('href', './node_modules/survey-core/survey-core.css');
shadowRoot.appendChild(surveyStyles);
shadowRoot.appendChild(rootElement);
  SurveyUI.renderSurvey(survey, rootElement);
});

