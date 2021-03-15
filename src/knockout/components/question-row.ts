import * as ko from "knockout";
import { SurveyElement } from "survey-core";
const template = require("./question-row.html");

export var SurveyQuestionComponent: any;

export interface SurveyElementTemplateData {
  name: string;
  data: SurveyElement;
  afterRender: (el: HTMLElement, context: SurveyElement) => void;
}

export interface SurveyElementViewModel {
  componentData: any;
  templateData: SurveyElementTemplateData;
}

ko.components.register("survey-element-component", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return <SurveyElementViewModel>params;
    },
  },
  template: template,
});
