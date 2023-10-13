import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";
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
      const chevronPointerDown = (_: any, e: any) => {
        q.dropdownListModel?.chevronPointerDown(e);
      };
      const clear = (_: any, e: any) => {
        q.dropdownListModel?.onClear(e);
      };
      const keyhandler = (_: any, e: any) => {
        q.dropdownListModel?.keyHandler(e);
        return true;
      };
      const blur = (_: any, e: any) => {
        q.dropdownListModel?.onBlur(e);
      };
      const focus = (_: any, e: any) => {
        q.dropdownListModel?.onFocus(e);
      };
      if (!q.dropdownListModel) {
        q.dropdownListModel = new DropdownListModel(params.question);
      }
      new ImplementorBase(q.dropdownListModel);
      return { question: q, model: q.dropdownListModel, click: click, clear: clear, keyhandler: keyhandler, blur: blur, focus: focus, chevronPointerDown: chevronPointerDown };
    },
  },
  template: template,
});
