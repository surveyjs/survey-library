import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./notifier.html");

export var NotifierViewModel: any;

ko.components.register("sv-notifier", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      new ImplementorBase(params.notifier);
      return params;
    },
  },
  template: template,
});
