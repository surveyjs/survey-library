import * as ko from "knockout";
import { DropdownListModel } from "survey-core";

const template = require("./dropdown.html");

export var DropdownViewModel: any;

ko.components.register("sv-dropdown", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const click = (_: any, e: any) => {
        params.question.dropdownListModel?.onClick(e);
      };
      const clear = (_: any, e: any) => {
        params.question.dropdownListModel?.onClear(e);
      };
      if (!params.question.dropdownListModel) {
        params.question.dropdownListModel = new DropdownListModel(params.question);
      }
      return { question: params.question, popupModel: params.question?.dropdownListModel?.popupModel, click: click, clear: clear };
    },
  },
  template: template,
});
