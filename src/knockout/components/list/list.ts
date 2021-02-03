import * as ko from "knockout";
import { ListModel } from "../../../list";
import { ImplementorBase } from "../../kobase";

const template = require("./list.html");

export var ListViewComponent: any;

ko.components.register("sv-list", {
  viewModel: {
    createViewModel: (params: ListModel, componentInfo: any) => {
      new ImplementorBase(params);
      return params;
    },
  },
  template: template,
});
