import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./pages.html");
export var progressPagesViewModel: any = function(params: any) {
  this.survey = params.model;
  return { model: this.survey };
};

ko.components.register("survey-progress-pages", {
  viewModel: progressPagesViewModel,
  template: template
});