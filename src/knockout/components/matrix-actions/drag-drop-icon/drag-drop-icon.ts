import * as ko from "knockout";

const template = require("./drag-drop-icon.html");

export var SurveyQuestionMatrixDynamicDragDropIcon: any;

ko.components.register("sv-matrix-drag-drop-icon", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return params.item.data;
    },
  },
  template: template,
});
