import * as ko from "knockout";
const template = require("./loading-indicator.html");

export var LoadingIndicatorViewModel: any;

ko.components.register("sv-loading-indicator", {
  viewModel: {
    createViewModel: (
      params: any,
      componentInfo: any
    ) => {}
  },
  template: template
});
