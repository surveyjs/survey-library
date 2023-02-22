import * as ko from "knockout";
import { SurveyModel } from "survey-core";
const template: string = require("./components-container.html");

export class ComponentsContainer {
  constructor(public survey: SurveyModel, private container: any) {
  }
  css = "sv-components-column";
  get components(): Array<any> {
    return this.survey.getContainerContent(this.container);
  }
}

ko.components.register("sv-components-container", {
  viewModel: {
    createViewModel: (params: any) => {
      const survey = params.survey as SurveyModel;
      return new ComponentsContainer(survey, params.container);
    },
  },
  template: template
});
