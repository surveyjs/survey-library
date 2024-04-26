import * as ko from "knockout";

const template = require("./question-error.html");

export var QuestionErrorComponent: any;

ko.components.register("sv-question-error", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params;
    }
  },
  template: template,
});
