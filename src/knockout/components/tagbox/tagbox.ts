import * as ko from "knockout";
import { DropdownMultiSelectListModel, ItemValue } from "survey-core";

const template = require("./tagbox.html");

export var TagboxViewModel: any;

ko.components.register("sv-tagbox", {
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
        q.dropdownListModel = new DropdownMultiSelectListModel(q);
      }
      return { question: q, popupModel: q?.dropdownListModel?.popupModel, click: click, clear: clear, keyup: keyup, blur: blur };
    },
  },
  template: template,
});
