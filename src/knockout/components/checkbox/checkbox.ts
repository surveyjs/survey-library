import * as ko from "knockout";
import { RendererFactory } from "../../../rendererFactory";

const template = require("./checkbox.html");

export var CheckboxViewModel: any;

ko.components.register("sv-checkbox", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "boolean",
  "checkbox",
  "sv-checkbox"
);
