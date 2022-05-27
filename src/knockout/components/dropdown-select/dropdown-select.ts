import * as ko from "knockout";
import { PopupUtils } from "src/utils/popup";
import { findParentByClass } from "src/utils/utils";
import { RendererFactory } from "survey-core";

const template = require("./dropdown-select.html");

export var DropdownSelectViewModel: any;

ko.components.register("sv-dropdown-select", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const click = (_: any, e: any) => {
        if (!!e && !!e.target) {
          const target = findParentByClass(e.target, params.question.cssClasses.control);
          if (!!target) {
            PopupUtils.updatePopupWidthBeforeShow(params.question.popupModel, target, e);
          }
        }
      };
      return { question: params.question, popupModel: params.question.popupModel, click: click };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");
