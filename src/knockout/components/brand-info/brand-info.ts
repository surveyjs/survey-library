import * as ko from "knockout";

const template = require("./brand-info.html");

export var BrandInfoComponent: any;

ko.components.register("sv-brand-info", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return {};
    }
  },
  template: template,
});
