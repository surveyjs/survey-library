import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";
import { ItemValue, RendererFactory } from "survey-core";

const template = require("./dropdown-select.html");

export var DropdownSelectViewModel: any;

ko.components.register("sv-dropdown-select", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      params.question.choices.forEach((choice: ItemValue) => {
        new ImplementorBase(choice);
      });
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