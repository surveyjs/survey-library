import * as ko from "knockout";
const template = require("./text-area.html");

export var TextAreaViewModel: any;

ko.components.register("sv-text-area", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element = componentInfo.element.querySelector && componentInfo.element.querySelector("textarea") || componentInfo.element.nextElementSibling;
      params.setElement(element);
      return {
        model: params,
        value: ko.observable(params.getTextValue() || ""),
      };
    },
  },
  template: template,
});
