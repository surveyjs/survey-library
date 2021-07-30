import * as ko from "knockout";
import { SurveyModel } from "survey-core";
import { SurveyTemplateRendererViewModel } from "../../../template-renderer";

const template = require("./template-renderer.html");

ko.components.register(SurveyModel.TemplateRendererComponentName, {
  viewModel: {
    createViewModel: (params: SurveyTemplateRendererViewModel) => {
      return params;
    },
  },
  template: template,
});
