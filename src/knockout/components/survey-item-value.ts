import * as ko from "knockout";
import { SurveyItemValueViewModel } from "survey-core";
const template = require("./survey-item-value.html");

export var SurveyItemValueComponent: any;

ko.components.register("survey-item-value-component", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return <SurveyItemValueViewModel>params;
    },
  },
  template: template,
});
