import * as ko from "knockout";
import { SurveyProgressModel } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./progress.html");

export class ProgressViewModel {
  constructor(public model: any) {}

  getProgressTextInBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextInBarCss(css);
  }
  getProgressTextUnderBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextUnderBarCss(css);
  }
}

ko.components.register("sv-progress-progress", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model);
    }
  },
  template: template
});

const templateBridge = "<!-- ko component: { name: 'sv-progress-progress', params: $data } --><!-- /ko -->";
ko.components.register("sv-progress-pages", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model);
    }
  },
  template: templateBridge
});
ko.components.register("sv-progress-questions", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model);
    }
  },
  template: templateBridge
});
ko.components.register("sv-progress-correctQuestions", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model);
    }
  },
  template: templateBridge
});
ko.components.register("sv-progress-requiredQuestions", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model);
    }
  },
  template: templateBridge
});
