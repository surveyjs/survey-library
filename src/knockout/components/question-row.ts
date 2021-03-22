import * as ko from "knockout";
import { SurveyElementViewModel } from "survey-core";
const template = require("./question-row.html");

export var SurveyElementComponent: any;

ko.components.register("survey-element-component", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return <SurveyElementViewModel>params;
    },
  },
  template: template,
});
