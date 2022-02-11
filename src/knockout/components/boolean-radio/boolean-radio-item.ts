import * as ko from "knockout";
import { RendererFactory } from "survey-core";

const template = require("./boolean-radio-item.html");

export var BooleanRadioItemViewModel: any;

ko.components.register("sv-boolean-radio-item", {
  viewModel: {
    createViewModel: (params: any) => {
      return params;
    },
  },
  template: template,
});
