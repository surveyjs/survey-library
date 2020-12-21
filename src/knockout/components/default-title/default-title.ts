import * as ko from "knockout";
import { RendererFactory } from "../../../rendererFactory";

const template = require("./default-title.html");

export var DefaultTitleViewModel: any;

ko.components.register("sv-default-title", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params.element;
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "element",
  "default-title",
  "sv-default-title"
);
