import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";
import { RendererFactory } from "survey-core";

const template = require("./rating-item-star.html");

export var RatingItemStarViewModel: any;

ko.components.register("sv-rating-item-star", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.item);
      return { question: params.question, item: params.item, index: params.index };
    },
  },
  template: template,
});