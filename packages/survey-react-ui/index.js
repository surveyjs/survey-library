
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

var json =  {
  showQuestionNumbers: true,
  autoFocusFirstQuestion: true,
  title: "Survey Title",
  elements: [
    {
      type: "boolean",
      name: "boolean_question",
      "labelTrue": "On-site",
      "labelFalse": "Remote",
      defaultValue: true
    },
  ]
};

/*
json = {
  "elements": [
    {
      "type": "dropdown",
      "name": "car",
      renderAs: "select",
      "title": "Which is the brand of your car?",
      "isRequired": true,
      "showNoneItem": true,
      "showOtherItem": true,
      "choices": [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ]
    }
  ]
};
*/
// json = {
//       elements: [
//         {
//           name: "name",
//           type: "boolean",
//           title: "Question title",
//           titleLocation: "hidden"
//         }
//       ]
//     };

// Survey.StylesManager.applyTheme("default");
// Survey.StylesManager.applyTheme("modern");
// Survey.StylesManager.applyTheme("defaultV2");

var model = new Survey.Model(json);
//model.setDesignMode(true);
//model.applyTheme(SurveyTheme.DefaultDark);
window.survey = model;

// class CustomTOCItem extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     const survey = this.props.model.locOwner;
//     const pageName = this.props.item.id;
//     const page = survey.getPageByName(pageName);
//     return (
//       <div style={{ width: "100%", height: "50px", background: "red", color: "lime" }}>
//         {page.title || page.name}
//       </div>
//     );
//   }
// }

// SurveyReact.ReactElementFactory.Instance.registerElement(
//   "sv-custom-toc-item",
//   (props) => {
//     return React.createElement(CustomTOCItem, props);
//   }
// );

// model.findLayoutElement("toc-navigation").data.listModel.itemComponent = "sv-custom-toc-item";

model.onUploadFiles
  .add(function (survey, options) {
    options.callback("success", options.files.map(function (file) {
      return {
        file: file,
        content: "https://surveyjs.io/Content/Images/design/Logo.svg"
      };
    }));
  });

ReactDOM.render(
  <SurveyReact.Survey model={model} />,
  document.getElementById("surveyElement")
);