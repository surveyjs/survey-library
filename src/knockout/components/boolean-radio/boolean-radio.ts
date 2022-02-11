import * as ko from "knockout";
import { RendererFactory } from "survey-core";
export * from "./boolean-radio-item";

const template = require("./boolean-radio.html");

export var BooleanRadioViewModel: any;

ko.components.register("sv-boolean-radio", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "sv-boolean-radio"
);
