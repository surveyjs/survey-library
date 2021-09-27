import * as ko from "knockout";
import { Action } from "survey-core";
import { ImplementorBase } from "../../kobase";
const template = require("./action.html");

ko.components.register("sv-action", {
  viewModel: {
    createViewModel: (params: any) => {
      const item: Action = params.item;
      new ImplementorBase(item);
      return params;
    },
  },
  template: template
});
