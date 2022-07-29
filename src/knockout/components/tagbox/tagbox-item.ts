import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./tagbox-item.html");

export var TagboxViewComponent: any;

ko.components.register("sv-tagbox-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.item);
      return {
        item: params.item,
        model: params.model,
        removeItem: (data: any, event: any) => {
          data.model.dropdownListModel.deselectItem(data.item.value);
          event.stopPropagation();
        }
      };
    },
  },
  template: template,
});
