import * as ko from "knockout";

const template = require("./detail-button.html");

export var SurveyQuestionMatrixDetailButton: any;

ko.components.register("sv-matrix-detail-button", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params.item.data;
    },
  },
  template: template,
});
