import * as ko from "knockout";

const template = require("./action-bar-separator.html");

export var ActionBarSeparatorViewModel: any;

ko.components.register("sv-action-bar-separator", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { css: params.item.innerCss };
    },
  },
  template: template,
});
