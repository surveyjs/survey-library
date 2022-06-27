import * as ko from "knockout";
import { RendererFactory } from "survey-core";

const template = require("./dropdown-select.html");

export var DropdownSelectViewModel: any;

ko.components.register("sv-dropdown-select", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question, onClick: () => { !!params.question.onOpenedCallBack && params.question.onOpenedCallBack(); } };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");