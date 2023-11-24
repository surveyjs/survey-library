import * as ko from "knockout";
import { RendererFactory } from "survey-core";

const template = require("./rating-dropdown.html");

export * from "./rating-dropdown-item";

export var RatingDropdownViewModel: any;

ko.components.register("sv-rating-dropdown", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "sv-rating-dropdown"
);
