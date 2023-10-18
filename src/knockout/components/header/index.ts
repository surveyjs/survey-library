import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

export * from "./cell";
export * from "./mobile";

const template = require("./index.html");

ko.components.register("sv-header", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      params.model.survey = params.survey;
      new ImplementorBase(params.model);
      return params;
    },
  },
  template: template,
});
