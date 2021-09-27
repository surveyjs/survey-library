import * as ko from "knockout";
const template = require("./action-bar-item.html");
export let ActionBarItemViewModel: any;

ko.components.register("sv-action-bar-item", {
  viewModel: {
    createViewModel: (params: any) => {
      return params;
    },
  },
  template: template
});
