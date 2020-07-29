import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./buttons.html");
export var progressButtonsComponent: any;

ko.components.register("survey-progress-buttons", {
    viewModel: function (params: any) {
      this.survey = params.model;
      return { model: this.survey, foo: "132" };
      //nodeDOMremoval чтобы отключать таймер
    },
    template: template
  });