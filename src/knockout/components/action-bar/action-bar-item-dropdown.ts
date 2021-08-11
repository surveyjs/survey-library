import * as ko from "knockout";

const template = require("./action-bar-item-dropdown.html");

export var ActionBarItemDropdownViewModel: any;

ko.components.register("sv-action-bar-item-dropdown", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => params.item
  },
  template: template,
});
