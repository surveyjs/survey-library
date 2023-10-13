import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./cover.html");

ko.components.register("sv-cover", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      params.model.survey = params.survey;
      new ImplementorBase(params.model);
      return params;
    },
  },
  template: template,
});
