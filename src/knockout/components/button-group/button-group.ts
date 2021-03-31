import * as ko from "knockout";
import { QuestionSelectBase, RendererFactory } from "survey-core";
const template = require("./button-group.html");

export * from "./button-group-item";

export class ButtonGroupViewModel {
  constructor(public question: QuestionSelectBase) {}
}
ko.components.register("sv-button-group", {
  viewModel: {
    createViewModel: (params: any) => {
      const question = params.question;
      return new ButtonGroupViewModel(question);
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "radiogroup",
  "button-group",
  "sv-button-group"
);
RendererFactory.Instance.registerRenderer(
  "dropdown",
  "button-group",
  "sv-button-group"
);
