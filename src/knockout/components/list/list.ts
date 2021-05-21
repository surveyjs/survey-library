import * as ko from "knockout";
import { ListModel } from "survey-core";
import { ImplementorBase } from "../../kobase";

const template = require("./list.html");

export var ListViewComponent: any;

ko.components.register("sv-list", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model: ListModel = params.model;
      new ImplementorBase(model);
      return model;
    },
  },
  template: template,
});
