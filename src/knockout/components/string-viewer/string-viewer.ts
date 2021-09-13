import * as ko from "knockout";
const template = require("./string-viewer.html");
export var StringViewerViewModel: any;

ko.components.register("sv-string-viewer", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params.locString;
    },
  },
  template: template
});
