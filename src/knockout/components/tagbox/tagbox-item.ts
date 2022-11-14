import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./tagbox-item.html");

export var TagboxViewComponent: any;

ko.components.register("sv-tagbox-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const item = params.item;
      new ImplementorBase(item);
      return {
        item: item,
        question: params.question,
        removeItem: (data: any, event: any) => {
          data.question.dropdownListModel.deselectItem(data.item.value);
          event.stopPropagation();
        }
      };
    },
  },
  template: template,
});
