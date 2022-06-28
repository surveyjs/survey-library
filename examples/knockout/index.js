function init() {
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
    showProgressBar: "both",
    description: "Survey Description",
    title: "Survey New Design Test",
    logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
    logoPosition: "left",
    questions: [
      {
        state: "expanded",
        type: "radiogroup",
        name: "carss",
        title: "Radiogroup",
        isRequired: true,
        colCount: 4,
        showClearButton: true,
        choices: [
          "None",
          "Ford",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
          "Peugeot",
          "Toyota",
          "Citroen"
        ]
      },
    ]
  };

  //Survey.StylesManager.applyTheme("default");
  //Survey.StylesManager.applyTheme("modern");
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
