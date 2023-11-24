import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./rating-dropdown-item.html");

export var RatingItemViewComponent: any;

ko.components.register("sv-rating-dropdown-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.item);
      return {
        item: params.item,
        description: params.item.description
      };
    },
  },
  template: template,
});
