import * as ko from "knockout";
const template = require("html-loader?interpolate!val-loader!./progress.html");
export var progressProgressViewModel: any = function(params: any) {
  return { model: params.model };
};
ko.components.register("survey-progress-progress", {
  viewModel: progressProgressViewModel,
  template: template
});

const templateBridge = "<!-- ko component: { name: 'survey-progress-progress', params: $data } --><!-- /ko -->";
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