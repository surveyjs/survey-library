import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./list-item-content.html");

export var ListItemContentViewComponent: any;

ko.components.register("sv-list-item-content", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.item);
      return {
        item: params.item,
        model: params.model
      };
    },
  },
  template: template,
});
