import * as ko from "knockout";
import { SurveyModel, SurveyTemplateRendererViewModel } from "survey-core";

const template = require("./template-renderer.html");

ko.components.register(SurveyModel.TemplateRendererComponentName, {
  viewModel: {
    createViewModel: (params: SurveyTemplateRendererViewModel) => {
      return params;
    },
  },
  template: template,
});
