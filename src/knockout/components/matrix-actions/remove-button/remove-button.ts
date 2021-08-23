import * as ko from "knockout";
const template = require("./remove-button.html");
export let SurveyQuestionMatrixDynamicRemoveButton: any;

ko.components.register("sv-matrix-remove-button", {
  viewModel: {
    createViewModel: (params: any) => {
      return params.item.data;
    },
  },
  template: template
});
