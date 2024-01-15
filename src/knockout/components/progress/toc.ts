import * as ko from "knockout";
import { TOCModel } from "survey-core";
const template: any = require("html-loader?interpolate!val-loader!./toc.html");

ko.components.register("sv-navigation-toc", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return {
        tocModel: params.model as TOCModel
      };
    },
  },
  template: template
});
