import * as ko from "knockout";

const template = require("./action-bar-separator.html");

export var ActionBarSeparatorViewModel: any;

ko.components.register("sv-action-bar-separator", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      var item = params.item;
      if (!!item) {
        return {
          css: item.innerCss,
        };
      }
      return {};
    },
  },
  template: template,
});
