import * as ko from "knockout";

const template = require("./file-preview.html");

export var SurveyFilePreview: any;

ko.components.register("sv-file-preview", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params;
    },
  },
  template: template,
});
