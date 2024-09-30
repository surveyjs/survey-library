import * as ko from "knockout";

const template = require("./item-content.html");

export var RankingItemContenViewModel: any;

ko.components.register("sv-ranking-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params;
    },
  },
  template: template,
});
