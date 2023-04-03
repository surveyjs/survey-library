import * as ko from "knockout";
import { createTOCListModel, getTocRootCss, SurveyModel } from "survey-core";
const template: any = require("html-loader?interpolate!val-loader!./toc.html");

ko.components.register("sv-progress-toc", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return {
        containerCss: getTocRootCss(params.model),
        survey: params.model,
        listModel: createTOCListModel(params.model)
      };
    },
  },
  template: template
});
