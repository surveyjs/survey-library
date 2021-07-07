import * as ko from "knockout";
import { ISurveyElement } from "survey-core";
import { RendererFactory } from "survey-core";

const template = require("./title-actions.html");

export var TitleActionViewModel: any;

ko.components.register("sv-title-actions", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element: ISurveyElement = params.element;
      return {
        element: element,
        toolbar: element.getTitleToolbar(),
      };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "element",
  "title-actions",
  "sv-title-actions"
);
