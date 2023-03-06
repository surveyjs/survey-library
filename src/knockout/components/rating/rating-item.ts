import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";
import { RendererFactory } from "survey-core";

const template = require("./rating-item.html");

export var RatingItemViewModel: any;

ko.components.register("sv-rating-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.item);
      return { question: params.question, item: params.item, index: params.index };
    },
  },
  template: template,
});