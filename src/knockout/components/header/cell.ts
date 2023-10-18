import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./cell.html");

ko.components.register("sv-cover-cell", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      // new ImplementorBase(params.model);
      return params.model;
    },
  },
  template: template,
});
