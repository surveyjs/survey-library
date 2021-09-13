import * as ko from "knockout";
import { ISurveyElement } from "survey-core";

const template = require("./title-content.html");

export var TitleContentViewModel: any;

ko.components.register("survey-element-title-content", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element: ISurveyElement = params.element;
      return { element: element };
    },
  },
  template: template,
});

