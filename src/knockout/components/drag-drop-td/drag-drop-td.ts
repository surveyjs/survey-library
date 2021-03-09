import * as ko from "knockout";
const template = require("html-loader?interpolate!val-loader!./drag-drop-td.html");

export class DragDropTdViewModel {
  constructor(public question: any, componentInfo: any) {}
}

ko.components.register("sv-drag-drop-td", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new DragDropTdViewModel(params.question, componentInfo);
      return viewModel;
    },
  },
  template: template,
});
