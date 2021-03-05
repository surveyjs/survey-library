import * as ko from "knockout";

const template = require("./remove-button.html");

export var MatrixRemoveButton: any;

ko.components.register("sv-matrix-remove-button", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params.item.data;
    },
  },
  template: template,
});
