import * as ko from "knockout";
import { SurveyModel } from "survey-core";
const template: string = require("./components-container.html");

ko.components.register("sv-components-container", {
  viewModel: {
    createViewModel: (params: any) => {
      const survey = params.survey as SurveyModel;
      return {
        css: "sd-components-column",
        survey,
        components: survey.getContainerContent(params.container)
      };
    },
  },
  template: template
});

export const ComponentsConteiner: any = undefined;