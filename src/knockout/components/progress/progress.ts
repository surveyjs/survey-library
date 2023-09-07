import * as ko from "knockout";
import { SurveyProgressModel } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./progress.html");

export class ProgressViewModel {
  constructor(public model: any, private container: string = "header") { }

  getProgressTextInBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextInBarCss(css);
  }
  getProgressTextUnderBarCss(css: any): string {
    return SurveyProgressModel.getProgressTextUnderBarCss(css);
  }
  getProgressCssClasses() {
    return this.model.getProgressCssClasses(this.container);
  }
}

ko.components.register("sv-progress-progress", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model, params.container);
    }
  },
  template: template
});

const templateBridge = "<!-- ko component: { name: 'sv-progress-progress', params: $data } --><!-- /ko -->";
ko.components.register("sv-progress-pages", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model, params.container);
    }
  },
  template: templateBridge
});
ko.components.register("sv-progress-questions", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model, params.container);
    }
  },
  template: templateBridge
});
ko.components.register("sv-progress-correctquestions", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model, params.container);
    }
  },
  template: templateBridge
});
ko.components.register("sv-progress-requiredquestions", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ProgressViewModel(params.model, params.container);
    }
  },
  template: templateBridge
});
