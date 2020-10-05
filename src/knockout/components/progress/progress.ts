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

var templateBridge = "<!-- ko component: { name: 'survey-progress-progress', params: $data } --><!-- /ko -->";
ko.components.register("survey-progress-pages", {
  viewModel: progressProgressViewModel,
  template: templateBridge
});
ko.components.register("survey-progress-questions", {
  viewModel: progressProgressViewModel,
  template: templateBridge
});
ko.components.register("survey-progress-correctquestions", {
  viewModel: progressProgressViewModel,
  template: templateBridge
});