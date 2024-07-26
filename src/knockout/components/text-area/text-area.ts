import * as ko from "knockout";
const template = require("./text-area.html");

export var TextAreaViewModel: any;

ko.components.register("sv-text-area", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return {
        model: params, value: ko.observable(params.getTextValue() || "")
      };
    },
  },
  template: template,
});
