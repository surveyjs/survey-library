import * as ko from "knockout";
import { TOCModel } from "survey-core";
const template: any = require("html-loader?interpolate!val-loader!./toc.html");

ko.components.register("sv-progress-toc", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new TOCModel(params.model);
    },
  },
  template: template
});
