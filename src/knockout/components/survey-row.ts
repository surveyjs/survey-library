import * as ko from "knockout";
import { SurveyElementViewModel } from "survey-core";
const template = require("./survey-row.html");

export var SurveyRowComponent: any;

ko.components.register("survey-row-component", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return <SurveyElementViewModel>params;
    },
  },
  template: template,
});
