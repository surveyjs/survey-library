import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./questions.html");
export var progressQuestionsViewModel: any = function(params: any) {
  this.survey = params.model;
  return { model: this.survey };
};

ko.components.register("survey-progress-questions", {
  viewModel: progressQuestionsViewModel,
  template: template
});