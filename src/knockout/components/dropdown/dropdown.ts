import * as ko from "knockout";
import { ImplementorBase } from "src/knockout/kobase";
import { DropdownListModel } from "survey-core";

const template = require("./dropdown.html");

export var DropdownViewModel: any;

ko.components.register("sv-dropdown", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const q = params.question;
      const click = (_: any, e: any) => {
        q.dropdownListModel?.onClick(e);
      };
      const clear = (_: any, e: any) => {
        q.dropdownListModel?.onClear(e);
      };
      const keyup = (_: any, e: any) => {
        q.dropdownListModel?.onKeyUp(e);
      };
      const blur = (_: any, e: any) => {
        q.dropdownListModel?.onBlur(e);
      };
      if (!q.dropdownListModel) {
        q.dropdownListModel = new DropdownListModel(params.question);
      }
      new ImplementorBase(q.dropdownListModel);
      return { question: q, model: q.dropdownListModel, click: click, clear: clear, keyup: keyup, blur: blur };
    },
  },
  template: template,
});
