import * as ko from "knockout";

const template = require("./choose-file.html");

export var SurveyNavigationButton: any;

ko.components.register("sv-file-choose-btn", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params;
    },
  },
  template: template,
});
