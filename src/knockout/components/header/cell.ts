import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./cell.html");

ko.components.register("sv-header-cell", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      // new ImplementorBase(params.model);
      return params.model;
    },
  },
  template: template,
});
