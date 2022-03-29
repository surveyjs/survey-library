import * as ko from "knockout";

const template = require("./survey-nav-button.html");

export var SurveyNavigationButton: any;

ko.components.register("sv-nav-btn", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params;
    },
  },
  template: template,
});
