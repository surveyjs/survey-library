import * as ko from "knockout";
import { RendererFactory } from "survey-core";

const template = require("./dropdown-select.html");

export var DropdownSelectViewModel: any;

ko.components.register("sv-dropdown-select", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const keyup = (_: any, e: any) => {
        params.question.onKeyUp(e);
      };
      const click = (_: any, e: any) => {
        params.question.onClick(e);
      };
      return { question: params.question, click: click, keyup: keyup };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");