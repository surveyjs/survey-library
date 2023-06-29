import * as ko from "knockout";
import { ActionDropdownViewModel, getActionDropdownButtonTarget } from "survey-core";

const template = require("./action-bar-item-dropdown.html");

export let ActionBarItemDropdownViewModel: any;

ko.components.register("sv-action-bar-item-dropdown", {
  viewModel: {
    createViewModel: (params: any) => {
      return {
        model: new ActionDropdownViewModel(params.item),
        getTarget: getActionDropdownButtonTarget
      };
    }
  },
  template: template
});
