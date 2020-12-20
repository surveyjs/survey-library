import * as ko from "knockout";
import { RendererFactory } from "../../../rendererFactory";

const template = require("./title-actions.html");

export var TitleActionViewModel: any;

ko.components.register("sv-title-actions", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return {
        question: params.question,
        items: params.question.getTitleActions(),
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

