import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./progress.html");
export var progressProgressComponent: any;

ko.components.register("survey-progress-progress", {
    viewModel: function (params: any) {
      this.survey = params.model;
      return { model: this.survey };
    },
    template: template
  });