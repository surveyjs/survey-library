import * as ko from "knockout";

const template = require("./dropdown.html");

export var DropdownViewModel: any;

ko.components.register("sv-dropdown", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { question: params.question };
    },
  },
  template: template,
});
