import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./list-item-group.html");

export let ListItemGroupViewComponent: any;

ko.components.register("sv-list-item-group", {
  viewModel: {
    createViewModel: (params: any) => {
      new ImplementorBase(params.item);
      return {
        item: params.item,
        model: params.model,
        disableTabStop: params.item.disableTabStop,
        itemClick: (data: any, event: any) => {
          data.model.onItemClick(data.item);
          event.stopPropagation();
        }
      };
    },
  },
  template: template,
});
