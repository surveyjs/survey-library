import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";
import { RendererFactory } from "survey-core";

const template = require("./rating-item-smiley.html");

export var RatingItemSmileyViewModel: any;

ko.components.register("sv-rating-item-smiley", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.item);
      return { question: params.question, item: params.item, index: params.index };
    },
  },
  template: template,
});