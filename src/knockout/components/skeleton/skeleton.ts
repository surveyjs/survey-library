import * as ko from "knockout";
import { RendererFactory } from "survey-core";

const template = require("./skeleton.html");

export var Skeleton: any;

ko.components.register("sv-skeleton", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question };
    },
  },
  template: template,
});
