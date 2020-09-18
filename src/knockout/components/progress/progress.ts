import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./progress.html");
export var progressProgressViewModel: any = function(params: any) {
  this.survey = params.model;
  return { model: this.survey };
};

ko.components.register("survey-progress-progress", {
  viewModel: progressProgressViewModel,
  template: template
});