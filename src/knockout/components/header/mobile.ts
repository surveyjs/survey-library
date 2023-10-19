import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./mobile.html");

ko.components.register("sv-header-mobile", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      // new ImplementorBase(params.model);
      return params.model;
    },
  },
  template: template,
});
