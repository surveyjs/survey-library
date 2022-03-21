import * as ko from "knockout";
import { ActionDropdownViewModel } from "survey-core";

const template = require("./action-bar-item-dropdown.html");

export let ActionBarItemDropdownViewModel: any;

ko.components.register("sv-action-bar-item-dropdown", {
  viewModel: {
    createViewModel: (params: any) => {
      return new ActionDropdownViewModel(params.item);
    }
  },
  template: template
});
