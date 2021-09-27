import * as ko from "knockout";
const template = require("./action-bar-item-dropdown.html");
export let ActionBarItemDropdownViewModel: any;

ko.components.register("sv-action-bar-item-dropdown", {
  viewModel: {
    createViewModel: (params: any) => params
  },
  template: template
});
