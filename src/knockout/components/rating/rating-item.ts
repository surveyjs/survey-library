import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";
import { RendererFactory } from "survey-core";

const template = require("./rating-item.html");

export var RatingItemViewModel: any;

ko.components.register("sv-rating-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.data);
      return { question: params.question, data: params.data, index: params.index };
    },
  },
  template: template,
});