import * as ko from "knockout";

const template = require("./paneldynamic-v2-navigator.html");

export var PanelDynamicV2NavigatorViewModel: any;

ko.components.register("sv-paneldynamic-v2-navigator", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question };
    },
  },
  template: template,
});