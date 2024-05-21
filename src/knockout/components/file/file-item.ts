import * as ko from "knockout";

const template = require("./file-item.html");

export var SurveyFileItem: any;

ko.components.register("sv-file-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params;
    }
  },
  template: template,
});
