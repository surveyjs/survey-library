import * as ko from "knockout";

const template = require("./action-bar-item.html");

export var ActionBarItemViewModel: any;

ko.components.register("sv-action-bar-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params.item;
    },
  },
  template: template,
});
